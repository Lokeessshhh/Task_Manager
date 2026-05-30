from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from models import TaskCreate, TaskUpdate, TaskResponse
from auth import get_current_user
from database import database
from uuid import UUID

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    stage: Optional[str] = Query(None, pattern="^(todo|inprogress|done)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    offset = (page - 1) * limit
    
    if stage:
        query = "SELECT * FROM tasks WHERE user_id = :user_id AND stage = :stage ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
        values = {"user_id": current_user["id"], "stage": stage, "limit": limit, "offset": offset}
    else:
        query = "SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
        values = {"user_id": current_user["id"], "limit": limit, "offset": offset}
        
    tasks = await database.fetch_all(query=query, values=values)
    return [dict(task) for task in tasks]

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    query = """
        INSERT INTO tasks (user_id, title, description, stage)
        VALUES (:user_id, :title, :description, :stage)
        RETURNING *
    """
    values = {
        "user_id": current_user["id"],
        "title": task.title,
        "description": task.description,
        "stage": task.stage
    }
    new_task = await database.fetch_one(query=query, values=values)
    return dict(new_task)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: UUID, task: TaskUpdate, current_user: dict = Depends(get_current_user)):
    # Get current task to ensure it exists and belongs to user
    check_query = "SELECT * FROM tasks WHERE id = :id AND user_id = :user_id"
    existing_task = await database.fetch_one(query=check_query, values={"id": task_id, "user_id": current_user["id"]})
    
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing_task)
        
    update_data["updated_at"] = "now()" # postgres handles this but we need to inject it
    
    set_clauses = []
    values = {"id": task_id, "user_id": current_user["id"]}
    
    for key, value in update_data.items():
        if key == "updated_at":
             set_clauses.append("updated_at = now()")
        else:
            set_clauses.append(f"{key} = :{key}")
            values[key] = value

    set_clause_str = ", ".join(set_clauses)
    
    query = f"""
        UPDATE tasks 
        SET {set_clause_str}
        WHERE id = :id AND user_id = :user_id
        RETURNING *
    """
    
    updated_task = await database.fetch_one(query=query, values=values)
    return dict(updated_task)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: UUID, current_user: dict = Depends(get_current_user)):
    query = "DELETE FROM tasks WHERE id = :id AND user_id = :user_id RETURNING id"
    deleted = await database.execute(query=query, values={"id": task_id, "user_id": current_user["id"]})
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return
