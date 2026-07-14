import { useState } from 'react'

const EMPTY_PROFILE = {
  displayName: '',
  username: '',
  email: '',
  bio: '',
  website: '',
}

const fieldNames = Object.keys(EMPTY_PROFILE)

function validateProfile(profile) {
  const errors = {}
  const displayName = profile.displayName.trim()
  const username = profile.username.trim()
  const email = profile.email.trim()
  const website = profile.website.trim()

  if (!displayName) {
    errors.displayName = 'Display name is required.'
  } else if (displayName.length < 2) {
    errors.displayName = 'Display name must be at least 2 characters.'
  } else if (displayName.length > 50) {
    errors.displayName = 'Display name must be 50 characters or fewer.'
  }

  if (!username) {
    errors.username = 'Username is required.'
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    errors.username =
      'Use 3–20 letters, numbers, or underscores without spaces.'
  }

  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (profile.bio.length > 160) {
    errors.bio = 'Bio must be 160 characters or fewer.'
  }

  if (website) {
    try {
      const url = new URL(website)

      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.website = 'Website must use http:// or https://.'
      }
    } catch {
      errors.website = 'Enter a complete URL, such as https://example.com.'
    }
  }

  return errors
}

function SettingsForm({ initialProfile = EMPTY_PROFILE, onSubmit }) {
  const [profile, setProfile] = useState({
    ...EMPTY_PROFILE,
    ...initialProfile,
  })
  const [touched, setTouched] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const errors = validateProfile(profile)

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }))
    setSubmitMessage('')
  }

  function handleBlur(event) {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [event.target.name]: true,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched(Object.fromEntries(fieldNames.map((field) => [field, true])))

    if (Object.keys(errors).length > 0) {
      setSubmitMessage('Please correct the highlighted fields.')
      return
    }

    const cleanProfile = {
      ...profile,
      displayName: profile.displayName.trim(),
      username: profile.username.trim(),
      email: profile.email.trim(),
      website: profile.website.trim(),
    }

    setIsSaving(true)
    setSubmitMessage('')

    try {
      await onSubmit?.(cleanProfile)
      setSubmitMessage('Profile settings saved.')
    } catch (error) {
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save your profile. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  function renderError(field) {
    if (!touched[field] || !errors[field]) return null

    return (
      <span id={`${field}-error`} role="alert" style={styles.error}>
        {errors[field]}
      </span>
    )
  }

  function inputAccessibility(field) {
    const hasError = Boolean(touched[field] && errors[field])

    return {
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${field}-error` : undefined,
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} style={styles.form}>
      <header style={styles.header}>
        <h2 style={styles.heading}>Profile settings</h2>
        <p style={styles.description}>
          Update the personal information shown on your profile.
        </p>
      </header>

      <div style={styles.field}>
        <label htmlFor="displayName" style={styles.label}>
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={profile.displayName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          maxLength={50}
          style={styles.input}
          {...inputAccessibility('displayName')}
        />
        {renderError('displayName')}
      </div>

      <div style={styles.field}>
        <label htmlFor="username" style={styles.label}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={profile.username}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="username"
          maxLength={20}
          style={styles.input}
          {...inputAccessibility('username')}
        />
        {renderError('username')}
      </div>

      <div style={styles.field}>
        <label htmlFor="email" style={styles.label}>
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          style={styles.input}
          {...inputAccessibility('email')}
        />
        {renderError('email')}
      </div>

      <div style={styles.field}>
        <label htmlFor="bio" style={styles.label}>
          Bio <span style={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          maxLength={160}
          style={{ ...styles.input, ...styles.textarea }}
          {...inputAccessibility('bio')}
        />
        <span style={styles.counter}>{profile.bio.length}/160</span>
        {renderError('bio')}
      </div>

      <div style={styles.field}>
        <label htmlFor="website" style={styles.label}>
          Website <span style={styles.optional}>(optional)</span>
        </label>
        <input
          id="website"
          name="website"
          type="url"
          value={profile.website}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://example.com"
          autoComplete="url"
          style={styles.input}
          {...inputAccessibility('website')}
        />
        {renderError('website')}
      </div>

      <footer style={styles.footer}>
        <span aria-live="polite" style={styles.status}>
          {submitMessage}
        </span>
        <button type="submit" disabled={isSaving} style={styles.button}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </footer>
    </form>
  )
}

const styles = {
  form: {
    width: 'min(100% - 32px, 640px)',
    boxSizing: 'border-box',
    margin: '32px auto',
    padding: 'clamp(20px, 5vw, 32px)',
    border: '1px solid var(--border, #e5e4e7)',
    borderRadius: '12px',
    background: 'var(--bg, #fff)',
    color: 'var(--text, #6b6375)',
    textAlign: 'left',
  },
  header: { marginBottom: '28px' },
  heading: { margin: '0 0 6px' },
  description: { margin: 0 },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    color: 'var(--text-h, #08060d)',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  optional: {
    color: 'var(--text, #6b6375)',
    fontWeight: 400,
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border, #e5e4e7)',
    borderRadius: '6px',
    background: 'var(--bg, #fff)',
    color: 'var(--text-h, #08060d)',
    font: 'inherit',
  },
  textarea: { resize: 'vertical' },
  counter: {
    alignSelf: 'flex-end',
    fontSize: '0.8rem',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.82rem',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    paddingTop: '8px',
  },
  status: {
    flex: '1 1 220px',
    fontSize: '0.85rem',
  },
  button: {
    padding: '10px 18px',
    border: 0,
    borderRadius: '6px',
    background: 'var(--accent, #7c3aed)',
    color: '#fff',
    cursor: 'pointer',
    font: 'inherit',
    fontWeight: 600,
  },
}

export default SettingsForm
