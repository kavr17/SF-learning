from aiohttp import web, ClientSession


async def post_handler(request):
    data = await request.json()
    async with ClientSession().ws_connect("http://127.0.0.1:8181/") as ws:
        await ws.send_str(data["news"])
        await ws.close()
    return web.Response(status=200)


async def ws_handler(request: web.Request):
    response = web.WebSocketResponse()
    available = response.can_prepare(request)
    if not available:
        with open("websocket.html", "rb") as fp:
            return web.Response(body=fp.read(), content_type="text/html")

    await response.prepare(request)

    try:
        print("Someone joined.")
        request.app["sockets"].append(response)

        async for msg in response:
            if msg.type == web.WSMsgType.TEXT:
                for ws in request.app["sockets"]:
                    if ws is not response:
                        await ws.send_str(msg.data)
            else:
                return response
        return response

    finally:
        request.app["sockets"].remove(response)
        print("Someone disconnected.")


async def on_shutdown(app: web.Application):
    for ws in app["sockets"]:
        await ws.close()


def main():
    app = web.Application()
    app["sockets"] = []
    app.router.add_route("GET", "/", ws_handler)
    app.router.add_route("POST", "/news", post_handler)
    app.on_shutdown.append(on_shutdown)
    web.run_app(app, host="127.0.0.1", port="8181")


if __name__ == "__main__":
    main()