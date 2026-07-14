import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

const settingsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  bio: z
    .string()
    .max(150, 'Bio must be no more than 150 characters')
    .optional(),
})

const inputClasses =
  'mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'

function SettingsForm({ onSubmit = async () => {} }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      bio: '',
    },
  })

  const bio = useWatch({ control, name: 'bio' }) ?? ''
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form
      className="mx-auto w-full max-w-lg space-y-6 rounded-xl bg-white p-6 shadow-md"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="username"
        >
          Username
        </label>
        <input
          {...register('username')}
          aria-describedby={errors.username ? 'username-error' : undefined}
          aria-invalid={Boolean(errors.username)}
          autoComplete="username"
          className={inputClasses}
          id="username"
          type="text"
        />
        {errors.username && (
          <p
            className="mt-1 text-sm text-red-600"
            id="username-error"
            role="alert"
          >
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-slate-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          {...register('email')}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          className={inputClasses}
          id="email"
          type="email"
        />
        {errors.email && (
          <p
            className="mt-1 text-sm text-red-600"
            id="email-error"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="bio"
          >
            Bio
          </label>
          <span
            aria-live="polite"
            className="text-sm text-slate-500"
            id="bio-counter"
          >
            {bio.length} / 150
          </span>
        </div>
        <textarea
          {...register('bio')}
          aria-describedby={
            errors.bio ? 'bio-counter bio-error' : 'bio-counter'
          }
          aria-invalid={Boolean(errors.bio)}
          className={inputClasses}
          id="bio"
          rows={4}
        />
        {errors.bio && (
          <p
            className="mt-1 text-sm text-red-600"
            id="bio-error"
            role="alert"
          >
            {errors.bio.message}
          </p>
        )}
      </div>

      <button
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSubmitting || hasErrors}
        type="submit"
      >
        {isSubmitting ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  )
}

export default SettingsForm
