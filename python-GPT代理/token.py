import asyncio
import websockets
import tiktoken

port1 = 32156


def num_tokens_from_string(string: str) -> int:
    encoding = tiktoken.get_encoding("cl100k_base")
    num_tokens = len(encoding.encode(string))
    return num_tokens


async def echo1(websocket, path):
    async for message in websocket:
        try:
            await websocket.send(str(num_tokens_from_string(message)))
        except Exception as e:
            print(f"Exception：{e}")
            await websocket.send(f"Exception：{e}")

start_server1 = websockets.serve(echo1, "localhost", port1)

try:
    asyncio.get_event_loop().run_until_complete(start_server1)
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    pass
finally:
    start_server1.close()
    asyncio.get_event_loop().run_until_complete(start_server1.wait_closed())
    asyncio.get_event_loop().close()
