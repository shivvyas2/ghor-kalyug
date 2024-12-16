import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

import { Box, TextField, Button, Alert, Typography } from "@mui/material";

const auth = getAuth(app);
const db = getFirestore(app);

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store username and email in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      setMessage("User successfully registered!");
      setTimeout(() => {
        navigate("/"); // Redirect to the login page after 5 seconds
      }, 5000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Box>
       <Typography variant="h4" textAlign="center" mb={2}>
                New User Registration
              </Typography>
              {message && (
                  <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mb: 2 }}>
                    {message}
                  </Alert>
              )}
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <TextField
                      fullWidth
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                  />

    <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
              />
  
        <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                  />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, p:3 }}>
                    Register
                  </Button>
      </form>
      </Box>
  );
};

export default Register;