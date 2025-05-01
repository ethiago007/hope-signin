import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { auth, db } from "../firebase"; 
import {
  signOut,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";



const DummyPage = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [typingFinished, setTypingFinished] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          setUsername(user.displayName || "Mysterious Player");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeUsername = () => {
    setAnchorEl(null);
    setOpenUsernameDialog(true);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setOpenPasswordDialog(true);
  };

  const handleSaveUsername = async () => {
    try {
      if (auth.currentUser && newUsername.trim()) {
        await updateProfile(auth.currentUser, { displayName: newUsername });
  
        if (userId) {
          await updateDoc(doc(db, "users", userId), { username: newUsername });
        }
  
        setUsername(newUsername); // Update state without refresh
        setSuccess("Username updated successfully!");
      }
      setOpenUsernameDialog(false);
    } catch (error) {
      setError("Error updating username.");
    }
  };
  

  const handleSavePassword = async () => {
    try {
      if (auth.currentUser && newPassword.trim().length >= 6) {
        await updatePassword(auth.currentUser, newPassword);
        setSuccess("Password updated successfully!");
      } else {
        setError("Password must be at least 6 characters long.");
      }
      setOpenPasswordDialog(false);
    } catch (error) {
      setError("Error updating password. Please try again.");
    }
  };

  const text = `Hiii, ${username || "Mysterious Player"}! 🌚 `;
  const message = `Hi there blah blah
If you’re here for the first time — welcome welcome! ✨
If you’ve been here before — welcome backkk (you came back? Aww) ❤️

So, real talk — this page used to be kinda pointless...
But guess what? It’s got a point now (lmao just roll with it abeg)

Enough yapping —
Hit that button to see something kewl 🤓`;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Avatar
            alt={username}
            sx={{ width: 50, height: 50, cursor: "pointer" }}
            onClick={handleAvatarClick}
          >
            {username ? username.charAt(0).toUpperCase() : "M"}
          </Avatar>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleChangeUsername}>Change Username</MenuItem>
            <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Typography variant="h4" sx={{ color: "white", paddingTop: 3 }}>
  {text.split("").map((char, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onAnimationComplete={() => {
        if (index === text.length - 1) {
          setTypingFinished(true);
        }
      }}
    >
      {char}
    </motion.span>
  ))}
</Typography>

{typingFinished && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
    <Typography variant="body1" sx={{ whiteSpace: "pre-line", marginTop: 3, color: "white" }}>
      {message}
    </Typography>
  </motion.div>
)}

<Button type=""
          variant="contained"
          
          sx={{
            mt: 2,
            backgroundColor: "#0064E6",
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#0064E6",
              border: "1px solid #0064E6",
            },
          }} >Vroom</Button>
      </Box>

      
      <Dialog open={openUsernameDialog} onClose={() => setOpenUsernameDialog(false)}>
        <DialogTitle>Change Username</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsernameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUsername} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

     
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePassword} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DummyPage;
