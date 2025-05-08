import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Auth State Changed:", user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    let email = identifier;
    let username = "";

    if (!isEmail(identifier)) {
      try {
        console.log("🔍 Searching Firestore for username:", identifier);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        console.log("📡 Firestore Query Executed for Username:", identifier);
        console.log(
          "🔥 Query Snapshot:",
          querySnapshot.docs.map((doc) => doc.data())
        ); // Log all docs found

        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email;
          username = identifier;
          console.log("✅ User found:", querySnapshot.docs[0].data());
        } else {
          console.log("❌ No user found with username:", identifier);
          setError("Username not found.");
          return;
        }
      } catch (err) {
        console.error("🔥 Firestore error:", err);
        setError("Error fetching user details.");
        return;
      }
    }

    try {
      console.log("🔑 Attempting login for email:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        console.log("⚠️ Email not verified:", email);
        setUnverified(true);
        setError("Please verify your email before logging in.");
        return;
      }

      if (!username) {
        console.log("🔍 Fetching username from Firestore using email:", email);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          username = querySnapshot.docs[0].data().username;
          console.log("✅ Username found:", username);
        }
      }

      console.log("✅ Login successful! Redirecting...");
      navigate("/dummy", { state: { username } });
    } catch (err) {
      console.error("❌ Login failed:", err.code, err.message);
      setError("Invalid email, username, or password. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccessMessage("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      setError("Error sending verification email. Try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      let username = user.displayName || "User";

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        username = querySnapshot.docs[0].data().username;
      }

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setSuccessMessage(
          "A verification email has been sent to your Google account."
        );
      }

      navigate("/dummy", { state: { username } });
    } catch (err) {
      setError("Google login failed. Try again later.");
    }
  };

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
    setError("");
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setResetEmail("");
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", resetEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError(
          "No account found with this email. Please check and try again."
        );
        return;
      }
      await sendPasswordResetEmail(auth, resetEmail);
      alert("A password reset email has been sent to your email address.");
      handleCloseForgotPassword(); // Close the popup
    } catch (err) {
      console.error("Error sending reset email:", err);

      if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email.");
      } else {
        setError("Error sending password reset email. Please try again later.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Box
        sx={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2 )",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <Typography
          variant=""
          component="h1"
          gutterBottom
          sx={{
            color: "black",
            textAlign: "center",
            fontWeight: "10px",
            fontSize: "45px",
          }}
        >
          Log<span className="purp">in</span>
        </Typography>
        {error && (
          <Alert severity={unverified ? "warning" : "error"} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <TextField
            label="Username or Email"
            fullWidth
            required
            variant="standard"
            margin="normal"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: "transparent",
              borderRadius: "4px",
              transition: "background-color 0.3s ease-in-out",

              "& .MuiInputBase-root": {
                color: "black", // input text color
              },

              "& .MuiInputBase-root:before": {
                borderBottom: "1px solid #ccc", // default underline
              },
              "& .MuiInputBase-root:hover:before": {
                borderBottom: "2px solid rgb(61, 44, 141)", // hover underline
              },
              "& .MuiInputBase-root:after": {
                borderBottom: "2px solid #3d2c8d", // focused underline
              },

              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3d2c8d",
                fontWeight: "bolder",
              },

              "& input": {
                color: "black",
                transition: "color 0.3s ease-in-out",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            variant="standard"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "4px",
              transition: "background-color 0.3s ease-in-out",

              "& .MuiInputBase-root": {
                color: "black", // input text color
              },

              "& .MuiInputBase-root:before": {
                borderBottom: "1px solid #ccc", // default underline
              },
              "& .MuiInputBase-root:hover:before": {
                borderBottom: "2px solid #3d2c8d", // hover underline
              },
              "& .MuiInputBase-root:after": {
                borderBottom: "2px solid #3d2c8d", // focused underline
              },

              "& .MuiInputLabel-root": {
                color: "black",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3d2c8d",
                fontWeight: "bolder",
              },

              "& input": {
                color: "black",
                transition: "color 0.3s ease-in-out",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#3d2c8d",
              borderRadius: "10px",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#3d2c8d",
                border: "1px solid #3d2c8d",
                borderRadius: "10px",
              },
            }}
          >
            Login
          </Button>

          <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            fullWidth
            sx={{
              mt: 3,
              color: "#3d2c8d",
              borderRadius: "10px",
              border: "2px solid #3d2c8d",
              "&:hover": {
                backgroundColor: "#3d2c8d",
                color: "white",
                border: "2px solid #3d2c8d",
                borderRadius: "10px",
              },
            }}
          >
            Login with Google
          </Button>

          {unverified && (
            <Button
              onClick={handleResendVerification}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            >
              Resend Verification Email
            </Button>
          )}
        </Box>
        <Typography sx={{ mt: 4, textAlign: "center" }}>
          <Link
            onClick={handleOpenForgotPassword}
            underline="hover"
            sx={{ cursor: "pointer", color: "#3d2c8d" }}
          >
            Forgot Password?
          </Link>
        </Typography>
        <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Enter your email"
              type="email"
              fullWidth
              variant="outlined"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "black",
                  "& fieldset": {
                    borderColor: "#ccc", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#3d2c8d", // hover border
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3d2c8d", // focused border
                    borderWidth: "2px",
                  },
                },

                "& input": {
                  color: "black",
                },

                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#3d2c8d",
                  fontWeight: "bolder",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForgotPassword} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleForgotPassword} color="secondary">
              Send Reset Link
            </Button>
          </DialogActions>
        </Dialog>
        <Typography sx={{ mt: 2, color: "black", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            href="/signup"
            underline="hover"
            sx={{ cursor: "pointer", color: "#3d2c8d" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
