import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

type User = {
  username: string;
  password: string;
};

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/api/login", user, {
        headers: { "Content-Type": "application/json" },
      });
      const jwtToken = res.headers.authorization || res.data?.token || "";
      if (jwtToken) {
        sessionStorage.setItem("jwt", jwtToken);
        onLogin(jwtToken);
      } else {
        throw new Error("No token in response");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Stack spacing={2} alignItems="center">
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={user.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          type="password"
          name="password"
          label="Password"
          value={user.password}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Login failed: check username/password"
        />
      </Stack>
    </div>
  );
}
