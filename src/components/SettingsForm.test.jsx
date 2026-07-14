import '@testing-library/jest-dom'
import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  it('does not submit when the email is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(<SettingsForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/username/i), 'ValidUser')
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(
      await screen.findByText('Enter a valid email address'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
