import { FormHelperText, Stack, TextField, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ecommerceOutlookAnimation } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { selectLoggedInUser, signupAsync, selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus } from '../AuthSlice';
import { toast } from 'react-toastify';
import { MotionConfig, motion } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export const Signup = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectSignupStatus);
  const error = useSelector(selectSignupError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // User redirection
  useEffect(() => {
    if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    } else if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  // Handle signup errors
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Handle successful signup
  useEffect(() => {
    if (status === 'fullfilled') {
      toast.success("Welcome! Verify your email to start shopping on mern-ecommerce.");
      reset();
    }
    return () => {
      dispatch(clearSignupError());
      dispatch(resetSignupStatus());
    };
  }, [status]);

  // Handle signup form submit
  const handleSignup = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(signupAsync(cred));
  }

  return (
    <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{ overflowY: "hidden" }}>

      {
        !is900 &&
        <Stack
          bgcolor={'black'}
          flex={1}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ position: 'relative' }}
        >
          {/* Left background image */}
          <Box
            component="img"
            src="/images/book-2.jpg" // replace with your image path
            alt="Book Heaven Illustration"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.8,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              padding: '1.5rem 2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                letterSpacing: '.05em',
              }}
            >
              Create your account with BOOK HEAVEN
            </Typography>
          </Box>
          </Stack>
      }

      <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
        <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <Stack rowGap={'.4rem'}>
            <Typography variant='h2' sx={{ wordBreak: "break-word" }} fontWeight={600}>BOOK HEAVEN</Typography>
            <Typography alignSelf={'flex-end'} color={'GrayText'} variant='body2'>- Read Everything You Love</Typography>
          </Stack>
        </Stack>

        <Stack mt={4} spacing={2} width={is480 ? "95vw" : '28rem'} component={'form'} noValidate onSubmit={handleSubmit(handleSignup)}>

          <MotionConfig whileHover={{ y: -5 }}>

            <motion.div>
              <TextField fullWidth {...register("name", { required: "Username is required" })} placeholder='Username' />
              {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField fullWidth {...register("email", { required: "Email is required", pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: "Enter a valid email" } })} placeholder='Email' />
              {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters` }
                })}
                placeholder='Password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                type='password'
                fullWidth
                {...register("confirmPassword", { required: "Confirm Password is required", validate: (value, fromValues) => value === fromValues.password || "Passwords don't match" })}
                placeholder='Confirm Password'
              />
              {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
            </motion.div>

          </MotionConfig>

          <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
            <LoadingButton sx={{ height: '2.5rem' }} fullWidth loading={status === 'pending'} type='submit' variant='contained'>Signup</LoadingButton>
          </motion.div>

          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
              <motion.div>
                <Typography mr={'1.5rem'} sx={{ textDecoration: "none", color: "text.primary" }} to={'/forgot-password'} component={Link}>Forgot password</Typography>
              </motion.div>

              <motion.div>
                <Typography sx={{ textDecoration: "none", color: "text.primary" }} to={'/login'} component={Link}>Already a member? <span style={{ color: theme.palette.primary.dark }}>Login</span></Typography>
              </motion.div>
            </MotionConfig>
          </Stack>

        </Stack>

      </Stack>
    </Stack>
  );
};