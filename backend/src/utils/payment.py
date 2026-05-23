from uuid import uuid4


def generate_mock_id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:10].upper()}"


def generate_mock_ids() -> tuple[str, str, str]:

    return (
        generate_mock_id("MOCK-OD"),
        generate_mock_id("MOCK-PY"),
        generate_mock_id("MOCK-SI"),
    )
