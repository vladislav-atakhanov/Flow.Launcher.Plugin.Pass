from pathlib import Path
from typing import Union
import pyperclip
from flox import Flox, ICON_APP_ERROR
from .keepass import KeePass


def unpack_list(lst, count):
    lst = list(lst)
    return lst + [None] * (count - len(lst))


class KeePassPlugin(Flox):
    def query(self, query: str):
        query = str(query).strip()
        length = None
        try:
            length = int(query)
        except:
            length = None

        if len(query) == 0 or length is not None:
            self.generate_password(length)
            return

        commands = query.split()

        action = commands[0]
        if action in ["add", "new"]:
            self.add_password(*commands[1:], action=action)
            return

        self.get_password(action)

    def show_error(self, title, subtitle="Please go to settings"):
        self.add_item(
            title=title,
            subtitle=subtitle,
            icon=ICON_APP_ERROR,
        )

    def add_password(self, *params, action="add"):
        if len(params) == 0:
            self.add_item(
                title=f"pass {action} <title> <username> <password>",
                subtitle="Add entry to database",
                icon="images/add-key.png",
            )
            return

        _params = title, username, password = unpack_list(params, 3)
        _username = "<username>" if username is None else username
        _password = "<password>" if password is None else password
        _title = "<title>" if title is None else title

        if password is None:
            if all((title, username)):
                self.add_item(
                    subtitle=f"{title} - {username}",
                    title="Generate password, copy and add to database",
                    method="generate_and_add_password",
                    parameters=[title, username],
                    icon="images/add-key.png",
                )
            else:
                self.add_item(
                    subtitle=f"{_title} - {_username}",
                    title="Generate password, copy and add to database",
                    icon="images/add-key.png",
                )

        if all(_params):
            self.add_item(
                subtitle=f"{title} - {username} {password}",
                title="Add password to database",
                method="add_entry",
                parameters=[title, username, password],
                icon="images/add-key.png",
            )
        else:
            self.add_item(
                subtitle=f"{_title} - {_username} {_password}",
                title="Add password to database",
                icon="images/add-key.png",
            )

    def generate_and_add_password(self, title, username):
        password = KeePass.generate_password()
        self.copy_text(password)
        self.add_entry(title, username, password)

    def add_entry(self, title, username, password):
        kp = self.open_database()
        if kp is None:
            return

        kp.add_password(title, username, password)

    def open_database(self) -> Union[KeePass, None]:
        path = self.settings.get("kdbx_path", None)
        password = self.settings.get("kdbx_password", None)

        path = Path(path)
        if not path.exists():
            return self.show_error(f"Can not open {path}")

        if password is None:
            return self.show_error("Password is undefined")

        try:
            return KeePass(path, str(password).strip())
        except:
            return self.show_error(
                f"Incorrect password for {path}",
                "Please go to settings and change password",
            )

    def generate_password(self, length=None):
        if length is None:
            length = 20
        self.add_item(
            title="Copy password to clipboard",
            subtitle=f"Generate {length}-symbol length password",
            method="copy_text",
            parameters=[length],
            icon="images/icon.png",
        )

    def generate_and_copy_password(self, length):
        password = KeePass.generate_password(length)
        self.copy_text(password)

    def get_password(self, title):
        kp = self.open_database()
        if kp is None:
            return

        for entry in kp.get_all_entries():
            if entry.title is None:
                continue

            if entry.title.lower().strip().startswith(title):
                password = entry.password
                t = f"{entry.title} - {entry.username}"
                self.add_item(
                    title=t,
                    subtitle=f"Copy password to clipboard",
                    method="copy_text",
                    parameters=[password],
                    icon="images/key.png",
                    context=[str(entry.uuid), t],
                )

    def context_menu(self, params):
        entry_uuid, title = params
        self.add_item(
            title=f"Delete {title}",
            subtitle="Delete entry from database",
            icon="images/delete-key.png",
            method="delete_entry",
            parameters=[entry_uuid],
        )

    def delete_entry(self, entry_uuid):
        kp = self.open_database()
        if kp is None:
            return

        kp.delete_entry(entry_uuid)

    def copy_text(self, data):
        pyperclip.copy(data)
