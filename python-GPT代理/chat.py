import asyncio
import websockets
import openai
import json


openai.api_key = "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"
#密钥额度已用完
port = 32155

async def echo(websocket, path):
    async for message in websocket:
        print(f"receive：{message}\n")
        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=json.loads(message))
            print(completion)
            await websocket.send(str(completion["choices"][0]["message"]))
        except Exception as e:
            print(f"Exception：{e}")
            await websocket.send(f"Exception：{e}")

start_server = websockets.serve(echo, "localhost", port)

try:
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    pass
finally:
    start_server.close()
    asyncio.get_event_loop().run_until_complete(start_server.wait_closed())
    asyncio.get_event_loop().close()
