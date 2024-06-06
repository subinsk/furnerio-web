"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState, Suspense } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
// routes
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
// config
// hooks
import { useBoolean } from "@/hooks/use-boolean";
// auth
// components
import Iconify from "@/components/iconify";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithGithub,
  signInWithGoogle,
} from "@/lib/supabase/actions/login";

// ----------------------------------------------------------------------

function JwtLoginView({ authType }: { authType: "login" | "signup" }) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");
  const [isSigningWithGoogle, setIsSigningWithGoogle] = useState(false);
  const [isSigningWithGithub, setIsSigningWithGithub] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get("returnTo");

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
    } catch (error: any) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === "string" ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">
        {authType === "login" ? "Sign in" : "Sign Up"} to Furnerio
      </Typography>
      <Stack spacing={0.5}>
        <LoadingButton
          variant="outlined"
          loading={isSigningWithGoogle}
          loadingPosition="start"
          startIcon={<Iconify icon="flat-color-icons:google" />}
          onClick={() => {
            setIsSigningWithGoogle(true);
            signInWithGoogle();
          }}
        >
          {authType === "login" ? "Sign in" : "Sign Up"} with Google
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          loading={isSigningWithGithub}
          loadingPosition="start"
          startIcon={<Iconify icon="mdi:github" />}
          onClick={() => {
            setIsSigningWithGithub(true);
            signInWithGithub();
          }}
        >
          {authType === "login" ? "Sign in" : "Sign Up"} with GitHub
        </LoadingButton>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: "flex-end" }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}

export default function AuthView({
  authType = "login",
}: {
  authType: "login" | "signup";
}) {
  return (
    <Suspense>
      <JwtLoginView authType={authType} />
    </Suspense>
  );
}
