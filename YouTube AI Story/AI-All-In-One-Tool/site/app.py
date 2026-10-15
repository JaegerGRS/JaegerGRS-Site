from __future__ import annotations

import json
import os
import re
import secrets
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["SECRET_KEY"] = os.environ.get("SITE_SECRET_KEY") or secrets.token_hex(32)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

SITE_DIR = Path(__file__).resolve().parent
DATA_DIR = SITE_DIR / "data"
USERS_FILE = DATA_DIR / "users.json"
DATA_DIR.mkdir(exist_ok=True)

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$")


def load_users() -> dict:
    if not USERS_FILE.exists():
        return {}
    try:
        with USERS_FILE.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {}


def save_users(users: dict) -> None:
    with USERS_FILE.open("w", encoding="utf-8") as handle:
        json.dump(users, handle, indent=2)


def generate_account_number() -> str:
    users = load_users()
    if not users:
        return "10000001"
    current_numbers = [int(user["account_number"]) for user in users.values() if user.get("account_number")]
    return str(max(current_numbers) + 1) if current_numbers else "10000001"


def generate_recovery_code() -> str:
    return "RC-" + secrets.token_urlsafe(12).upper().replace("-", "")[:16]


def ensure_demo_account() -> None:
    users = load_users()
    if users:
        return

    demo_password = "SecurePass!2026"
    account_number = "10000001"
    recovery_code = "RC-1F6H8M7N4Q2P9X7K"
    users[account_number] = {
        "account_number": account_number,
        "name": "Demo User",
        "email": "demo@creatorstudio.local",
        "password_hash": generate_password_hash(demo_password),
        "recovery_hash": generate_password_hash(recovery_code),
        "recovery_code": recovery_code,
        "created_at": "system-init",
    }
    save_users(users)
    print("\nDemo account created for local testing:")
    print(f"Account number: {account_number}")
    print(f"Secure code: {demo_password}")
    print(f"Recovery code: {recovery_code}")
    print("Keep the recovery code safe; it is required for account recovery.\n")


ensure_demo_account()


def get_user_by_account_number(account_number: str) -> dict | None:
    users = load_users()
    return users.get(str(account_number))


def is_logged_in() -> bool:
    return "account_number" in session


@app.route("/")
def index():
    if is_logged_in():
        return redirect(url_for("homepage"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        account_number = (request.form.get("account_number") or "").strip()
        password = (request.form.get("password") or "").strip()
        recovery_code = (request.form.get("recovery_code") or "").strip()

        user = get_user_by_account_number(account_number)
        if not user:
            flash("Account number not recognised.", "error")
            return render_template("login.html")

        if password and check_password_hash(user["password_hash"], password):
            session["account_number"] = user["account_number"]
            session["name"] = user["name"]
            session["recovery_code"] = user.get("recovery_code")
            return redirect(url_for("homepage"))

        if recovery_code and check_password_hash(user["recovery_hash"], recovery_code):
            session["account_number"] = user["account_number"]
            session["name"] = user["name"]
            session["recovery_code"] = user.get("recovery_code")
            flash("Recovery code accepted. Please reset your secure code as soon as possible.", "success")
            return redirect(url_for("homepage"))

        flash("The secure code or recovery code is invalid.", "error")
        return render_template("login.html")

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip()
        password = (request.form.get("password") or "").strip()
        confirm_password = (request.form.get("confirm_password") or "").strip()

        if not name or not email or not password or not confirm_password:
            flash("Please complete every field.", "error")
            return render_template("register.html")

        if password != confirm_password:
            flash("The secure codes do not match.", "error")
            return render_template("register.html")

        if not PASSWORD_PATTERN.match(password):
            flash("Use at least 12 characters, including upper and lower case, a number and a symbol.", "error")
            return render_template("register.html")

        users = load_users()
        for user in users.values():
            if user.get("email", "").lower() == email.lower():
                flash("That email already has an account.", "error")
                return render_template("register.html")

        account_number = generate_account_number()
        recovery_code = generate_recovery_code()

        new_user = {
            "account_number": account_number,
            "name": name,
            "email": email,
            "password_hash": generate_password_hash(password),
            "recovery_hash": generate_password_hash(recovery_code),
            "recovery_code": recovery_code,
            "created_at": "now",
        }
        users[account_number] = new_user
        save_users(users)

        session["account_number"] = account_number
        session["name"] = name
        session["recovery_code"] = recovery_code
        flash("Account created successfully. Please save your recovery code. It is required for recovery.", "success")
        return redirect(url_for("homepage"))

    return render_template("register.html")


@app.route("/homepage")
def homepage():
    if not is_logged_in():
        return redirect(url_for("login"))

    account_number = session.get("account_number")
    user = get_user_by_account_number(account_number)
    if not user:
        session.clear()
        return redirect(url_for("login"))

    return render_template("homepage.html", user=user)


@app.route("/dashboard")
def dashboard():
    if not is_logged_in():
        return redirect(url_for("login"))

    account_number = session.get("account_number")
    user = get_user_by_account_number(account_number)
    if not user:
        session.clear()
        return redirect(url_for("login"))

    recovery_code = session.get("recovery_code") or user.get("recovery_code")
    return render_template("dashboard.html", user=user, recovery_code=recovery_code)


@app.route("/logout")
def logout():
    session.clear()
    flash("You have been signed out.", "success")
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
