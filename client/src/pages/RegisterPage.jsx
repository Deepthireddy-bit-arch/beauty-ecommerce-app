

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { registerReset } from "../redux/slices/registerSlice";
import { registerUser } from "../redux/reducers/thunks/registerThunk";
import { selectRegisterError, selectRegisterLoading, selectRegisterSuccess, selectRegisterUser } from "../redux/registerUser/selectors/registerSelectors";

/* Minimal CSS — only what Bootstrap can't provide */
const extra = `
  


    .register-bg {
  width: 100%;
  min-height: 100vh;

  background-image: url("https://images.unsplash.com/photo-1522199710521-72d69614c702");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

  /* underline-only input */
  .input-underline {
    border: none !important;
    border-bottom: 1.5px solid #ced4da !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding-left: 0 !important;
    background: transparent !important;
    
    font-size: 0.875rem;
    color: #374151;
  }
  .input-underline:focus {
    border-bottom-color: #7c3aed !important;
    box-shadow: none !important;
    background: transparent !important;
  }
  .input-underline.is-invalid {
    border-bottom-color: #dc3545 !important;
    background-image: none !important;
  }
  .input-underline.is-valid {
    border-bottom-color: #198754 !important;
    background-image: none !important;
  }
  .input-underline::placeholder { color: #9ca3af; }

  .icon-prefix {
    border: none !important;
    border-bottom: 1.5px solid #ced4da !important;
    border-radius: 0 !important;
    background: transparent !important;
    padding-left: 0 !important;
    color: #7c3aed;
  }

  .toggle-pw {
    border: none !important;
    border-bottom: 1.5px solid #ced4da !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #9ca3af;
    font-size: 0.9rem;
  }
  .toggle-pw:hover { color: #7c3aed; }

  /* password strength bars */
  .strength-bar {
    height: 4px;
    border-radius: 2px;
    flex: 1;
    background: #e5e7eb;
    transition: background .3s;
  }

/* purple gradient button */
  .btn-purple {
    background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%);
    border: none;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: filter .2s ease, transform .15s ease, box-shadow .2s ease;
  }
 .btn-purple:hover:not(:disabled) {
  background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%);
  filter: brightness(1.08);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
  border-color: transparent;
  transform: translateY(-1px);
}
 .btn-purple:hover:not(:disabled) {
  background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%);
  filter: brightness(1.08);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
  border-color: transparent;
  transform: translateY(-1px);
}
  .btn-purple:disabled { opacity: 0.6; }

  .link-purple { color: #7c3aed !important; font-weight: 600; }
  .link-purple:hover { color: #5b21b6 !important; }
`;

/* password strength helper */
function getStrength(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

export default function RegisterPage() {
    const dispatch = useDispatch();
    const loading = useSelector(selectRegisterLoading);
    const success = useSelector(selectRegisterSuccess);
    const error = useSelector(selectRegisterError);
    const user = useSelector(selectRegisterUser);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [touched, setTouched] = useState({ name: false, email: false, password: false });

    /* ── Validation rules (match backend: name, email, password required) ── */
    const nameErr = touched.name && name.trim().length < 2;
    const emailErr = touched.email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const pwErr = touched.password && password.length < 6;

    const isFormValid = !nameErr && !emailErr && !pwErr && name && email && password;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });
        if (!isFormValid) return;
        dispatch(registerUser(name, email, password));
    };

    const pwStrength = getStrength(password);

    return (
        <>
            <style>{extra}</style>

            {/* Full-page purple background */}
            <div className="register-bg d-flex align-items-center justify-content-center p-3">

                {/* White card */}
                <div
                    className="bg-white rounded-4 shadow-lg p-4 p-md-5 position-relative"
                    style={{ width: "100%", maxWidth: 420 }}
                >
                    {/* Close / reset button */}
                    <button
                        className="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Close"
                        onClick={() => dispatch(registerReset())}
                    />

                    {/* ── Success screen ── */}
                    {success ? (
                        <div className="text-center py-3">
                            <div className="fs-1 mb-3">🎉</div>
                            <h5 className="fw-bold mb-1" style={{ color: "#1a1a2e" }}>
                                Account created!
                            </h5>
                            <p className="text-muted small mb-1">Welcome, {user?.name}!</p>
                            <p className="text-muted small mb-4">{user?.email}</p>
                            <a href="/login" className="btn btn-purple text-white w-100 py-2 rounded-3 mb-2">
                                Go to Login
                            </a>
                            <button
                                className="btn btn-link text-muted small"
                                onClick={() => dispatch(registerReset())}
                            >
                                Register another account
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Title */}
                            <h4 className="fw-bold text-center mb-4" style={{ color: "#1a1a2e" }}>
                                Register
                            </h4>

                            {/* API error alert */}
                            {error && (
                                <div className="alert alert-danger py-2 small mb-3" role="alert">
                                    ⚠️ {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>

                                {/* ── Name (mandatory) ── */}
                                <div className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text icon-prefix">👤</span>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                            className={`form-control input-underline${touched.name ? (nameErr ? " is-invalid" : " is-valid") : ""
                                                }`}
                                        />
                                        {nameErr && (
                                            <div className="invalid-feedback">
                                                Name must be at least 2 characters.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Email (mandatory) ── */}
                                <div className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text icon-prefix">✉️</span>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                            className={`form-control input-underline${touched.email ? (emailErr ? " is-invalid" : " is-valid") : ""
                                                }`}
                                        />
                                        {emailErr && (
                                            <div className="invalid-feedback">
                                                Enter a valid email address.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Password (mandatory) ── */}
                                <div className="mb-1">
                                    <div className="input-group">
                                        <span className="input-group-text icon-prefix">🔒</span>
                                        <input
                                            type={showPw ? "text" : "password"}
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                            className={`form-control input-underline${touched.password ? (pwErr ? " is-invalid" : " is-valid") : ""
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            className="input-group-text toggle-pw"
                                            onClick={() => setShowPw((v) => !v)}
                                            aria-label="Toggle password"
                                        >
                                            {showPw ? "🙈" : "👁"}
                                        </button>
                                        {pwErr && (
                                            <div className="invalid-feedback">
                                                Password must be at least 6 characters.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Password strength bars */}
                                {password && (
                                    <div className="mb-3 mt-2">
                                        <div className="d-flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((n) => (
                                                <div
                                                    key={n}
                                                    className="strength-bar"
                                                    style={{
                                                        background: pwStrength >= n
                                                            ? strengthColor[pwStrength]
                                                            : "#e5e7eb",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <small
                                            className="fw-semibold"
                                            style={{ color: strengthColor[pwStrength], fontSize: "0.72rem" }}
                                        >
                                            {strengthLabel[pwStrength]} password
                                        </small>
                                    </div>
                                )}

                                {/* ── Submit ── */}
                                <div className="d-grid mt-4 mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-purple text-white py-2 rounded-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                                Creating account…
                                            </>
                                        ) : (
                                            "Register Now"
                                        )}
                                    </button>
                                </div>

                                {/* Login link */}
                                <p className="text-center text-muted small mb-0">
                                    Already a member?{" "}
                                    <a href="/login" className="text-decoration-none link-purple">
                                        Login here
                                    </a>
                                </p>

                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}