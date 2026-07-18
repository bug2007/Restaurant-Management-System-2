import { Box, Typography, InputLabel, FormControlLabel, Checkbox, Button, CircularProgress, InputAdornment, IconButton, OutlinedInput, FormHelperText } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import loginImg1 from '../assets/login_illustration.png'
import { useRef, useState } from 'react'
import { loginAdmin } from '../util/http.js';
import classes from './Login.module.css'
import ErrorMsg from '../components/ErrorMsg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { authStateActions } from '../store/authState-slice.js';

type LoginField = 'userName' | 'password';

 
export default function Login() {
    const navigate = useNavigate();
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<LoginField[]>([])
    const rememberMeRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data, variables) => {  // variables: the arguments passed to mutate()
            localStorage.setItem('accessToken', data.token)
            localStorage.setItem('refreshToken', data.refreshToken)
            localStorage.setItem('refreshTokenExpiryTime', data.refreshTokenExpiryTime)
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            dispatch(authStateActions.logAdminIn(data.user))
            if (rememberMeRef.current?.checked) {
                localStorage.setItem('savedUsername', variables.userName)
            } else {
                localStorage.removeItem('savedUsername')
            }
            setLoginSuccess(true)
            setTimeout(() => {navigate('/dashboard/employees')}, 2000)
        }
    })

    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrors([])
        const formData = new FormData(event.currentTarget)
        const userName = formData.get('userName') as string
        const password = formData.get('password') as string

        const isUsernameEmpty = !userName || userName.trim() === '';
        const isPasswordEmpty = !password || password.trim() === '';

        if (isUsernameEmpty && isPasswordEmpty) {
            setErrors(['userName', 'password'])
            return
        }
        else if (isUsernameEmpty) {
            setErrors(['userName'])
            return
        }
        else if (isPasswordEmpty) {
            setErrors(['password'])
            return
        }
        mutate({userName, password})
    }

    function handleClickShowPassword() {
        setShowPassword((show) => !show)
    }

    const savedUsername = localStorage.getItem('savedUsername') || '';

    return (
        <>
        <Box className={classes.carouselLoginBox} sx={{
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
        }}>
            <Box 
                className={classes.loginForm} 
                sx={{
                    pt: '8rem', pb: '2rem', 
                    backgroundColor: '#ffffff', 
                    width: '50%', 
                    px: '2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    gap: '5rem'}}>
                <form 
                    onSubmit={handleLogin} 
                    style={{
                        display: 'flex', 
                        width: '80%', 
                        flexDirection: 'column', 
                        gap: '25px',
                        }}>
                    <Typography sx={{fontSize: '32px', marginBottom: '4rem'}}>BSS Restaurant</Typography>
                    
                    <div>
                        <InputLabel htmlFor='userName' sx={{fontSize: '20px', color: 'black', marginBottom: '5px'}}>Username</InputLabel>
                        <OutlinedInput
                            error={errors.includes('userName')}
                            id='userName'
                            name='userName'
                            fullWidth
                            placeholder='Enter your username'
                            disabled={isPending || loginSuccess}
                            defaultValue='admin@mail.com'
                        ></OutlinedInput>
                        {errors.includes('userName') && <FormHelperText error sx={{fontSize: '15px'}}>Please fill out this field.</FormHelperText>}
                    </div>

                    <div>
                        <InputLabel htmlFor='password' sx={{fontSize: '20px', color: 'black', marginBottom: '5px'}}>Password</InputLabel>
                        <OutlinedInput
                            error={errors.includes('password')}
                            id='password'
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            placeholder='Enter your password'
                            defaultValue='Admin@123'
                            sx={{'& input::-ms-reveal': {display: 'none'}}}
                            endAdornment={<InputAdornment position='end'>
                                        <IconButton onClick={handleClickShowPassword} edge='end'>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>}
                            >
                        </OutlinedInput>
                        {errors.includes('password') && <FormHelperText error sx={{fontSize: '15px'}}>Please fill out this field.</FormHelperText>}
                    </div>

                    <FormControlLabel
                        control={
                            <Checkbox
                                slotProps={{
                                    input: { ref: rememberMeRef }
                                }}
                                defaultChecked={savedUsername ? true : false}
                                name="rememberMe"
                            />
                        }
                        label="Remember me"
                        sx={{width: 'fit-content'}}
                    />
                    <Button type='submit' 
                        sx={{
                            padding: '10px 5px', 
                            borderRadius: '5px', 
                            color: 'white', 
                            fontSize: '15px', 
                            '&.Mui-disabled': { backgroundColor: '#f29641', color: 'white'}}} 
                            color='primary' 
                            variant='contained' 
                            disabled={isPending || loginSuccess}>{isPending ? <><CircularProgress size="15px" sx={{color: '#f4f9db', marginRight: '10px'}} enableTrackSlot /> LOGGING IN</> : 'LOGIN'}</Button>
                    {isError && (<ErrorMsg message={error.message} />)}
                    {loginSuccess && (
                        <Typography 
                            color="success" 
                            sx={{ 
                                fontWeight: 'bold', 
                                fontSize: '18px' }}>
                            Login successful! Redirecting...
                        </Typography>
                    )}
                </form>
            </Box>
            <Box 
                sx={{
                    width: '50%',
                    background: `url(${loginImg1}) center / cover no-repeat`
            }}></Box>
        </Box>
        </>
    )
}