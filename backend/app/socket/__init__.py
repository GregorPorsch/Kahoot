def register_socket_events(socketio):
    from .events import on_create, on_join, on_leave, on_start, on_next_question

    socketio.on_event('create', on_create)
    socketio.on_event('join', on_join)
    socketio.on_event('leave', on_leave)
    socketio.on_event('start', on_start)
    socketio.on_event('next', on_next_question)