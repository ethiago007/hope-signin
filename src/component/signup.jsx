import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from "firebase/auth";
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
      }, 2000); 

    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      
      if (userCredential.additionalUserInfo.isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
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
        paddingRight: 2
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{color: "white"}}>
        Sign Up
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      <Box component="form" onSubmit={handleSignup} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Username"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
    "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6", fontWeight: "bolder" } 
  }}
        />
        <TextField
          label="Email"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6", fontWeight: "bolder" } 
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
    "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6", fontWeight: "bolder" } 
  }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
    "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6", fontWeight: "bolder" } 
  }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{
    mt: 2,
    backgroundColor: "#0064E6",
    color: "white",
    "&:hover": {
      backgroundColor: "white", 
      color: "#0064E6", 
      border: "1px solid #0064E6", 
    },
  }}>
          Sign Up
        </Button>

        <Button
          onClick={handleGoogleSignup}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            color: "#0064E6",
            border: "2px solid white", 
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#0064E6", 
              color: "white", 
              border: "2px solid #0064E6", 
            },
          }}
        >
          Sign Up with Google
        </Button>
      </Box>

      <Typography sx={{ mt: 2, color: "white" }}>
        Already have an account?{" "}
        <Link href="/login" underline="hover" sx={{ cursor: "pointer" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Signup;
