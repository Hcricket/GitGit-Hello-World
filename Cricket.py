
def read():
    for i, t in enumerate(tasks, 1):
        print(f"{i}. {t['title']} - {t['subtasks']}")

def update(index, title=None, subtasks=None):
    if 0 <= index < len(tasks):
        if title:
            tasks[index]['title'] = title
        if subtasks is not None:
            tasks[index]['subtasks'] = subtasks

def delete(index):
    if 0 <= index < len(tasks):
        tasks.pop(index)

# Now call the functions
create("Buy groceries", ["Milk", "Eggs"])
create("Study Python")
read()
update(1, subtasks=["Read book", "Practice"])
delete(0)
read()