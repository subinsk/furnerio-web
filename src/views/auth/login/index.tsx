"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
// routes
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
// config
import { PATH_AFTER_LOGIN } from "@/config";
// hooks
import { useBoolean } from "@/hooks/use-boolean";
// auth
import { signIn } from "next-auth/react";
// components
import Iconify from "@/components/iconify";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useRouter, useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

export default function LoginView() {
  // router
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

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
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error !== null) {
        throw new Error(response?.error);
      }

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg("Invalid Credentials");
    }
  });

  const handleGoogleLogin = async () => {
    try {
      signIn("google");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      signIn("github");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      //   await loginWithTwitter?.();
    } catch (error) {
      console.error(error);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Furnerio</Typography>
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
        component={RouterLink}
        href={""}
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

  const renderLoginOption = (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, ::after": {
            borderTopStyle: "dashed",
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <Iconify icon="eva:google-fill" color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <Iconify icon="eva:github-fill" />
        </IconButton>
      </Stack>
    </div>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}

      {renderLoginOption}
    </FormProvider>
  );
}
