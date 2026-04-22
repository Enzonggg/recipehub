import { useEffect, useState } from 'react'
import { getMeApi, updateMyPasswordApi, updateMyProfileApi } from '../../services/authApi.js'
import { getAuthToken, setAuthUser } from '../../utils/authSession.js'

export function CustomerAccountPage() {
  const [profile, setProfile] = useState({ fullName: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const token = getAuthToken()

      if (!token) {
        setProfileError('You are not authenticated. Please sign in again.')
        setIsLoadingProfile(false)
        return
      }

      try {
        const response = await getMeApi(token)
        setProfile({
          fullName: response.user?.fullName || '',
          email: response.user?.email || '',
        })
      } catch (error) {
        setProfileError(error.message || 'Failed to load account profile.')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [])

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setProfileMessage('')
    setProfileError('')

    if (!profile.fullName || !profile.email) {
      setProfileError('Full name and email are required.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      setProfileError('You are not authenticated. Please sign in again.')
      return
    }

    setIsSavingProfile(true)

    try {
      const response = await updateMyProfileApi(token, profile)
      setAuthUser(response.user)
      setProfileMessage('Profile updated successfully.')
    } catch (error) {
      setProfileError(error.message || 'Failed to save profile.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSave = async (event) => {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordError('Please complete all password fields.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      setPasswordError('You are not authenticated. Please sign in again.')
      return
    }

    setIsSavingPassword(true)

    try {
      await updateMyPasswordApi(token, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setPasswordMessage('Password updated successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <section className="panel-section mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Account Settings</h1>
        <p className="mt-2 text-sm opacity-75">Manage your profile information and password.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="panel-card p-6">
          <h2 className="text-2xl font-semibold">Personal Details</h2>
          <p className="mt-1 text-sm opacity-70">Update your basic account information.</p>

          <form className="mt-5 space-y-4" onSubmit={handleProfileSave}>
            <label className="form-control">
              <span className="label-text mb-1 text-sm">Full Name</span>
              <input
                className="panel-input"
                value={profile.fullName}
                onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                disabled={isLoadingProfile}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1 text-sm">Email</span>
              <input
                className="panel-input"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                disabled={isLoadingProfile}
              />
            </label>

            {profileError ? <p className="text-sm text-error">{profileError}</p> : null}
            {profileMessage ? <p className="text-sm text-success">{profileMessage}</p> : null}

            <button className="btn btn-primary w-full" type="submit" disabled={isLoadingProfile || isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </article>

        <article className="panel-card p-6">
          <h2 className="text-2xl font-semibold">Change Password</h2>
          <p className="mt-1 text-sm opacity-70">Use a strong password you have not used before.</p>

          <form className="mt-5 space-y-4" onSubmit={handlePasswordSave}>
            <label className="form-control">
              <span className="label-text mb-1 text-sm">Current Password</span>
              <input
                className="panel-input"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1 text-sm">New Password</span>
              <input
                className="panel-input"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1 text-sm">Confirm New Password</span>
              <input
                className="panel-input"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmNewPassword}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmNewPassword: event.target.value }))}
              />
            </label>

            {passwordError ? <p className="text-sm text-error">{passwordError}</p> : null}
            {passwordMessage ? <p className="text-sm text-success">{passwordMessage}</p> : null}

            <button className="btn btn-outline w-full" type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </article>
      </div>
    </section>
  )
}
