from databases import Database
from config import get_settings

settings = get_settings()

# We configure connection pool min=2, max=10
database = Database(settings.DATABASE_URL, min_size=2, max_size=10)

async def connect_db():
    await database.connect()

async def disconnect_db():
    await database.disconnect()

async def create_tables():
    # Execute raw SQL for schema setup
    # asyncpg execute() via databases doesn't like multiple statements in one call
    commands = [
        """
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          stage TEXT NOT NULL CHECK (stage IN ('todo', 'inprogress', 'done')),
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        """,
        "CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);",
        "CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage);",
        "CREATE INDEX IF NOT EXISTS idx_tasks_user_stage ON tasks(user_id, stage);",
        "CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);"
    ]
    
    for command in commands:
        await database.execute(command)
