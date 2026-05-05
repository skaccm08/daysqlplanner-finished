from fastapi import FastAPI, HTTPException #web integration
from fastapi.middleware.cors import CORSMiddleware #api connect to frontend
from pydantic import BaseModel #shaping and type constraints
from typing import List, Optional 
from datetime import datetime  
import mysql.connector #db driver

app = FastAPI() #init

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def getdb():
    return mysql.connector.connect(
        host="****",
        port=3307,
        user="****",
        password="****",
        database="****",
        connection_timeout=5
    )
def singqoterfcr(value): #helper funcs
    return "'" + str(value).replace("'", "''") + "'"

def tobool(value):
    return 1 if value else 0

class UserCreate(BaseModel): #api structure funcs for auth and crud
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    name: str
    password: str

class EventCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    is_important: bool = False
    tags: List[str] = []

class EventUpdate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    is_important: bool = False
    tags: Optional[List[str]] = None

@app.post("/users") #create new user with POST req
def create_user(user: UserCreate): 
    conn = getdb()
    cursor = conn.cursor()

    try:
        cursor.execute(f"""
            INSERT INTO users (Name_, Email, Passwrd)
            VALUES ({singqoterfcr(user.name)}, {singqoterfcr(user.email)}, {singqoterfcr(user.password)})
        """)

        user_id = cursor.lastrowid
        conn.commit()

        return {
            "message": "User created",
            "user_id": user_id
        }

    except mysql.connector.Error as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

@app.post("/login") #login auth
def login_user(user: UserLogin):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT UserID, Name_, Email
            FROM users
            WHERE Name_ = {singqoterfcr(user.name)}
              AND Passwrd = {singqoterfcr(user.password)}
        """)

        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return result

    finally:
        cursor.close()
        conn.close()

@app.post("/events") #create new event
def create_event(event: EventCreate):
    conn = getdb()
    cursor = conn.cursor()

    try:
        cursor.execute(f"""
            INSERT INTO events_
            (UserID, Title, Descr, StartTime, EndTime, Location, IsImportant)
            VALUES (
            {event.user_id},
            {singqoterfcr(event.title)},
            {singqoterfcr(event.description)},
            {singqoterfcr(event.start_time)},
            {singqoterfcr(event.end_time)},
            {singqoterfcr(event.location)},
            {tobool(event.is_important)}
            )
        """)

        event_id = cursor.lastrowid

        for tag in event.tags:
            cursor.execute(f"""
                INSERT IGNORE INTO Tags (Name_)
                VALUES ({singqoterfcr(tag)})
            """)

            cursor.execute(f"""
                SELECT TagID
                FROM Tags
                WHERE Name_ = {singqoterfcr(tag)}
            """)

            tag_id = cursor.fetchone()[0]

            cursor.execute(f"""
                INSERT INTO EventTags (EventID, TagID)
                VALUES ({event_id}, {tag_id})
            """)

        conn.commit()

        return {
            "message": "Event created",
            "event_id": event_id
        }

    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

@app.get("/events/user/{user_id}") #grabs all events of user with details
def get_events(user_id: int):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT 
                e.EventID,
                e.UserID,
                e.Title,
                e.Descr,
                e.StartTime,
                e.EndTime,
                e.Location,
                e.IsImportant,
                GROUP_CONCAT(t.Name_ ORDER BY t.Name_ SEPARATOR ', ') AS Tags
            FROM events_ e
            LEFT JOIN EventTags et ON e.EventID = et.EventID
            LEFT JOIN Tags t ON et.TagID = t.TagID
            WHERE e.UserID = {user_id}
            GROUP BY 
                e.EventID,
                e.UserID,
                e.Title,
                e.Descr,
                e.StartTime,
                e.EndTime,
                e.Location,
                e.IsImportant
            ORDER BY e.StartTime ASC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()

@app.get("/events/user/{user_id}/tag/{tag_name}") #grab user-specific tags
def get_events_by_tag(user_id: int, tag_name: str):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT 
                e.EventID,
                e.UserID,
                e.Title,
                e.Descr,
                e.StartTime,
                e.EndTime,
                e.Location,
                e.IsImportant,
                GROUP_CONCAT(t2.Name_ ORDER BY t2.Name_ SEPARATOR ', ') AS Tags
            FROM events_ e
            JOIN EventTags et ON e.EventID = et.EventID
            JOIN Tags t ON et.TagID = t.TagID
            LEFT JOIN EventTags et2 ON e.EventID = et2.EventID
            LEFT JOIN Tags t2 ON et2.TagID = t2.TagID
            WHERE e.UserID = {user_id}
              AND t.Name_ = {singqoterfcr(tag_name)}
            GROUP BY 
                e.EventID,
                e.UserID,
                e.Title,
                e.Descr,
                e.StartTime,
                e.EndTime,
                e.Location,
                e.IsImportant
            ORDER BY e.StartTime ASC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


@app.get("/events/user/{user_id}/stats")
def get_event_stats(user_id: int):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT DATE(StartTime) AS day, COUNT(*) AS event_count
            FROM events_
            WHERE UserID = {user_id}
            GROUP BY DATE(StartTime)
            ORDER BY day ASC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()

@app.get("/events/user/{user_id}/busiest-day")
def get_busiest_day(user_id: int):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT day, event_count
            FROM (
                SELECT DATE(StartTime) AS day, COUNT(*) AS event_count
                FROM events_
                WHERE UserID = {user_id}
                GROUP BY DATE(StartTime)
            ) AS daily_counts
            WHERE event_count = (
                SELECT MAX(event_count)
                FROM (
                    SELECT COUNT(*) AS event_count
                    FROM events_
                    WHERE UserID = {user_id}
                    GROUP BY DATE(StartTime)
                ) AS max_counts
            )
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()

@app.put("/events/{event_id}")  #update existing event
def update_event(event_id: int, event: EventUpdate):
    conn = getdb()
    cursor = conn.cursor()

    try:
        cursor.execute(f"""
            UPDATE events_
            SET Title = {singqoterfcr(event.title)},
                Descr = {singqoterfcr(event.description)},
                StartTime = {singqoterfcr(event.start_time)},
                EndTime = {singqoterfcr(event.end_time)},
                Location = {singqoterfcr(event.location)},
                IsImportant = {tobool(event.is_important)}
            WHERE EventID = {event_id}
        """)

        if event.tags is not None:
            cursor.execute(f"""
                DELETE FROM EventTags
                WHERE EventID = {event_id}
            """)

            for tag in event.tags:
                cursor.execute(f"""
                    INSERT IGNORE INTO Tags (Name_)
                    VALUES ({singqoterfcr(tag)})
                """)

                cursor.execute(f"""
                    SELECT TagID
                    FROM Tags
                    WHERE Name_ = {singqoterfcr(tag)}
                """)

                tag_id = cursor.fetchone()[0]

                cursor.execute(f"""
                    INSERT INTO EventTags (EventID, TagID)
                    VALUES ({event_id}, {tag_id})
                """)

        conn.commit()

        return {"message": "Event updated"}

    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

@app.delete("/events/{event_id}") #delete activity
def delete_event(event_id: int):
    conn = getdb()
    cursor = conn.cursor()

    try:
        cursor.execute(f"""
            DELETE FROM EventTags
            WHERE EventID = {event_id}
        """)

        cursor.execute(f"""
            DELETE FROM events_
            WHERE EventID = {event_id}
        """)

        conn.commit()

        return {"message": "Event deleted"}

    except mysql.connector.Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()

@app.get("/tags/user/{user_id}")
def get_tags_for_user(user_id: int):
    conn = getdb()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(f"""
            SELECT DISTINCT t.Name_
            FROM Tags t
            JOIN EventTags et ON t.TagID = et.TagID
            JOIN events_ e ON et.EventID = e.EventID
            WHERE e.UserID = {user_id}
            ORDER BY t.Name_ ASC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()