import { login, signup, getRedirectUrl } from './auth.js';
import { showToast } from './components.js';

function setupPasswordToggle(form) {
    const toggleBtns = form.querySelectorAll('#toggle-password, .password-toggle, [aria-label*="password"]');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.closest('div').querySelector('input[type="password"], input[type="text"]');
            if (!input) return;
            const icon = btn.querySelector('i, svg');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) icon.setAttribute('data-lucide', 'eye-off');
                btn.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                if (icon) icon.setAttribute('data-lucide', 'eye');
                btn.setAttribute('aria-label', 'Show password');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
        });
    });
}

function validateField(input) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    if (!group) return true;

    let isValid = true;
    let errorMsg = '';

    if (input.required && !input.value.trim()) {
        isValid = false;
        errorMsg = 'This field is required';
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email';
    } else if (input.type === 'password' && input.value.length < 6) {
        isValid = false;
        errorMsg = 'Password must be at least 6 characters';
    }

    if (!isValid) {
        group.classList.add('form-group--error');
        if (errorEl) errorEl.textContent = errorMsg;
    } else {
        group.classList.remove('form-group--error');
        if (errorEl) errorEl.textContent = '';
    }

    return isValid;
}

function setupRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.closest('.form-group').classList.contains('form-group--error')) {
                validateField(input);
            }
        });
    });
}

export function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    setupPasswordToggle(form);
    setupRealTimeValidation(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });

        if (!isFormValid) return;

        const email = form.querySelector('#login-email')?.value || form.email?.value;
        const password = form.querySelector('#login-password')?.value || form.password?.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.classList.add('btn--loading');

        setTimeout(() => {
            const result = login({ email, password });
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn--loading');

            if (result.success) {
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    window.location.href = getRedirectUrl();
                }, 500);
            } else {
                showToast(result.error, 'error');
            }
        }, 800);
    });
}

export function initSignupPage() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    setupPasswordToggle(form);
    setupRealTimeValidation(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });

        const password = form.querySelector('#signup-password')?.value || form.password?.value;
        const confirmField = form.querySelector('#signup-confirm') || form['confirmPassword'];
        const confirmPassword = confirmField?.value;
        
        if (confirmPassword !== undefined && password !== confirmPassword) {
            isFormValid = false;
            const confirmGroup = confirmField.closest('.form-group');
            if (confirmGroup) {
                confirmGroup.classList.add('form-group--error');
                const errorEl = confirmGroup.querySelector('.form-error');
                if (errorEl) errorEl.textContent = 'Passwords do not match';
            }
        }

        if (!isFormValid) return;

        const name = form.querySelector('#signup-name')?.value || form.name?.value;
        const email = form.querySelector('#signup-email')?.value || form.email?.value;
        const college = form.querySelector('#signup-college')?.value || form.college?.value;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.classList.add('btn--loading');

        setTimeout(() => {
            const result = signup({ name, email, college, password });
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn--loading');

            if (result.success) {
                showToast('Account created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = getRedirectUrl();
                }, 500);
            } else {
                showToast(result.error, 'error');
            }
        }, 800);
    });
}
