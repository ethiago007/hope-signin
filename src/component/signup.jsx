import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox.");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const isNewUser = userCredential.additionalUserInfo?.isNewUser || false;

      if (isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || "",
          email: user.email,
        });
      }

      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }

      navigate("/dummy");
    } catch (err) {
      setError(err.message);
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
          paddingRight: "40px"
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
          Signup
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSignup}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <TextField
            label="Username"
            fullWidth
            required
            variant="standard"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            label="Email"
            fullWidth
            required
            variant="standard"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            label="Confirm Password"
            type="password"
            fullWidth
            required
            variant="standard"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </Button>

          <Button
            onClick={handleGoogleSignup}
            variant="standard"
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
            Sign Up with Google
          </Button>
        </Box>

        <Typography sx={{ mt: 2, color: "black", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" underline="hover" sx={{ cursor: "pointer", color: "#3d2c8d" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
