import os
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, session, url_for


def create_app():
    base_dir = Path(__file__).resolve().parent
    app = Flask(
        __name__,
        template_folder=str(base_dir / "templates"),
        static_folder=str(base_dir / "static"),
    )
    app.config["SECRET_KEY"] = os.environ.get("SITE_SECRET_KEY") or "createvra-dev-secret"
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SITE_COOKIE_SECURE", "0") == "1"

    DEMO_ACCOUNT = {
        "account_number": "10000001",
        "password": "SecurePass!2026",
        "recovery_code": "RC-1F6H8M7N4Q2P9X7K",
        "name": "Demo User",
    }

    @app.context_processor
    def inject_session_state():
        return {"signed_in": bool(session.get("account_number"))}

    @app.route("/")
    def home():
        return render_template("home.html", active_page="home")

    @app.route("/products")
    def products():
        return render_template("products.html", active_page="products")

    @app.route("/features")
    def features():
        return render_template("features.html", active_page="features")

    @app.route("/roadmap")
    def roadmap():
        return render_template("roadmap.html", active_page="roadmap")

    @app.route("/pricing")
    def pricing():
        return render_template("pricing.html", active_page="pricing")

    @app.route("/brand")
    def brand():
        return render_template("brand.html", active_page="brand")

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            account_number = (request.form.get("account_number") or "").strip()
            password = (request.form.get("password") or "").strip()
            recovery_code = (request.form.get("recovery_code") or "").strip().upper()

            valid_password = password and password == DEMO_ACCOUNT["password"]
            valid_recovery = recovery_code and recovery_code == DEMO_ACCOUNT["recovery_code"]

            if account_number == DEMO_ACCOUNT["account_number"] and (valid_password or valid_recovery):
                session["account_number"] = account_number
                session["name"] = DEMO_ACCOUNT["name"]
                flash("Welcome back. Your Createvra dashboard is ready.", "success")
                return redirect(url_for("home"))

            flash("The account number and login credentials are invalid.", "error")

        return render_template("login.html", active_page="login")

    @app.route("/logout")
    def logout():
        session.clear()
        flash("You have been signed out.", "success")
        return redirect(url_for("home"))

    return app
