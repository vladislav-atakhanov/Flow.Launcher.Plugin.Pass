from typing import List
from pykeepass import PyKeePass
from pykeepass.entry import Entry
import secrets
import string
from pathlib import Path
from uuid import UUID

alphabet = string.ascii_letters + string.digits + string.punctuation


class KeePass:
    def __init__(self, path: Path, password: str) -> None:
        self.kp = PyKeePass(str(path), password)

    def get_all_entries(self) -> List[Entry]:
        return self.kp.entries

    def get_entries_by_title(self: PyKeePass, title: str) -> List[Entry] | None:
        return self.kp.find_entries_by_title(title)

    def add_password(self, title, username, password):
        self.kp.add_entry(
            self.kp.root_group, title=title, username=username, password=password
        )
        self.kp.save()

    def delete_entry(self, uuid: str = None):
        uuid = UUID(uuid)
        for entry in self.kp.find_entries_by_uuid(uuid):
            entry: Entry
            entry.delete()
        self.kp.save()

    @staticmethod
    def generate_password(length: int = 20):
        return "".join(secrets.choice(alphabet) for i in range(length))
