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
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "white" }}
      >
        Login
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
          variant="outlined"
          margin="normal"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "4px",
            transition: "background-color 0.3s ease-in-out",
            "& .MuiOutlinedInput-root": {
              color: "black",
              "& fieldset": { borderColor: "#86B6F6" },
              "&:hover fieldset": { borderColor: "#86B6F6" },
              "&.Mui-focused": {
                backgroundColor: "white",
              },
            },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#86B6F6",
              fontWeight: "bolder",
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "4px",
            transition: "background-color 0.3s ease-in-out",
            "& .MuiOutlinedInput-root": {
              color: "black",
              "& fieldset": { borderColor: "#86B6F6" },
              "&:hover fieldset": { borderColor: "#86B6F6" },
              "&.Mui-focused": {
                backgroundColor: "white",
              },
            },
            "& .MuiInputLabel-root": { color: "white" },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#86B6F6",
              fontWeight: "bolder",
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#0064E6",
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#0064E6",
              border: "1px solid #0064E6",
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
            mt: 2,
            color: "#0064E6",
            border: "2px solid #0064E6",
            "&:hover": {
              backgroundColor: "#0064E6",
              color: "white",
              border: "2px solid #0064E6",
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
      <Typography sx={{ mt: 2 }}>
        <Link
          onClick={handleOpenForgotPassword}
          underline="hover"
          sx={{ cursor: "pointer" }}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleForgotPassword} color="primary">
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
      ;
      <Typography sx={{ mt: 2, color: "white" }}>
        Don't have an account?{" "}
        <Link href="/signup" underline="hover" sx={{ cursor: "pointer" }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
