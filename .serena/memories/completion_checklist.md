# Completion Checklist

When completing a task, ensure the following steps are performed:

1. **Linting**: Run `yarn lint` to ensure no linting errors.
2. **Formatting**: Run `yarn prettier:write` to ensure consistent code style.
3. **Testing**:
   - If changes were made to contracts, run contract tests in `apps/contracts`.
   - If changes were made to the frontend, verify the app starts and functions as expected.
4. **Documentation**: Update code comments (prefer Japanese) or README files if necessary. Ensure the `walkthrough.md` is updated with proof of verification.
5. **Environment**: Verify all required Supabase environment variables are set in `.env.local`.
6. **Persistence**: Verify Semaphore identity recovery from Supabase DB on login.
