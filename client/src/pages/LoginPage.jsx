

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginReset } from "../redux/slices/loginSlice";

import { loginUser } from "../redux/reducers/thunks/loginThunk";
import { selectLoginError, selectLoginLoading, selectLoginUser } from "../redux/registerUser/selectors/registerSelectors";

/* Only styles Bootstrap cannot provide */
const extra = `

.login-bg {
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
    font-family: 'Poppins', sans-serif;
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

  /* icon prefix */
  .icon-prefix {
    border: none !important;
    border-bottom: 1.5px solid #ced4da !important;
    border-radius: 0 !important;
    background: transparent !important;
    padding-left: 0 !important;
    color: #7c3aed;
  }

  /* toggle btn */
  .toggle-pw {
    border: none !important;
    border-bottom: 1.5px solid #ced4da !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #9ca3af;
    font-size: 0.9rem;
  }
  .toggle-pw:hover { color: #7c3aed; }

  /* purple gradient button */
  .btn-purple {
    background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%);
    border: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    transition: opacity .2s, transform .15s;
  }
  .btn-purple:hover:not(:disabled) { opacity: 0.88; color: #fff; }
  .btn-purple:active:not(:disabled) { transform: scale(.99); }
  .btn-purple:disabled { opacity: 0.6; }

  .link-purple { color: #7c3aed !important; font-weight: 600; }
  .link-purple:hover { color: #5b21b6 !important; }
`;

export default function LoginPage() {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoginLoading);
    const error = useSelector(selectLoginError);
    const user = useSelector(selectLoginUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailErr = touched.email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const pwErr = touched.password && password.length < 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (emailErr || pwErr || !email || !password) return;
        dispatch(loginUser(email, password));
    };

    return (
        <>
            <style>{extra}</style>

            {/* Full-page purple background */}
            <div className="login-bg d-flex align-items-center justify-content-center">

                {/* White card */}
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5 position-relative" style={{ width: "100%", maxWidth: 500 }}>

                    {/* Close button */}
                    <button
                        className="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Close"
                        onClick={() => dispatch(loginReset())}
                    />

                    {/* Title */}
                    <h4 className="fw-bold text-center mb-4" style={{ color: "#1a1a2e" }}>Login</h4>

                    {/* Success state */}
                    {user ? (
                        <div className="text-center py-3">
                            <div className="fs-1 mb-3">🛍️</div>

                            <h4 className="fw-bold mb-2" style={{ color: "#7c3aed" }}>
                                Welcome to ShopHub
                            </h4>

                            <p className="fw-semibold mb-1">
                                Hello, {user.name} 👋
                            </p>

                            <p className="text-muted small mb-4">
                                Explore the latest fashion, electronics, and trending products.
                            </p>

                            <button
                                className="btn btn-purple text-white w-100 py-2 rounded-3"
                                onClick={() => dispatch(loginReset())}
                            >
                                Log outo
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>

                            {/* Error alert */}
                            {error && (
                                <div className="alert alert-danger py-2 small" role="alert">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text icon-prefix">✉️</span>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                        className={`form-control input-underline${touched.email ? (emailErr ? " is-invalid" : " is-valid") : ""}`}
                                    />
                                    {emailErr && (
                                        <div className="invalid-feedback">Enter a valid email address.</div>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mb-2">
                                <div className="input-group">
                                    <span className="input-group-text icon-prefix">🔒</span>
                                    <input
                                        type={showPw ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                        className={`form-control input-underline${touched.password ? (pwErr ? " is-invalid" : " is-valid") : ""}`}
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
                                        <div className="invalid-feedback">At least 6 characters required.</div>
                                    )}
                                </div>
                            </div>



                            {/* Submit button */}
                            <div className="d-grid mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-purple text-white py-2 rounded-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className=" spinner-border spinner-border-sm me-2 m-1" role="status" aria-hidden="true" />
                                            Signing in…
                                        </>
                                    ) : (
                                        "Login Now"
                                    )}
                                </button>
                            </div>

                            {/* Sign up link */}
                            <p className="text-center text-muted small mb-0">
                                Not a member?{" "}
                                <a href="/register" className="text-decoration-none link-purple">
                                    Signup here
                                </a>
                            </p>

                        </form>
                    )}

                </div>
            </div>
        </>
    );
}