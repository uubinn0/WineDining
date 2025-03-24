from fastapi import FastAPI

app = FastAPI()


@app.get("/recommends")
async def root():
    return {"message": "Hello World"}