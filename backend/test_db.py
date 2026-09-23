from sqlalchemy import text

from app.core.database import engine


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("DATABASE CONNECTION SUCCESSFUL:", result.scalar())

except Exception as error:
    print("DATABASE CONNECTION FAILED")
    print(error)