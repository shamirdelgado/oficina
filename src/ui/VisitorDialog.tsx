import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { setVisitor, useVisitor } from '../state/visitor'

export function VisitorDialog({ ready }: { ready: boolean }) {
  const { t } = useLanguage()
  const { editing, name } = useVisitor()
  const [value, setValue] = useState(name ?? '')
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (ready && editing) { setValue(name ?? ''); dialog.current?.showModal() }
    else dialog.current?.close()
  }, [ready, editing, name])
  return <dialog ref={dialog} className="visitor-dialog" onCancel={event => event.preventDefault()} aria-labelledby="visitor-title">
    <form onSubmit={event => { event.preventDefault(); setVisitor(value.trim() || t.visitorDefault) }}>
      <h1 id="visitor-title">{t.nameQuestion}</h1>
      <label htmlFor="visitor-name">{t.nameLabel}</label>
      <input id="visitor-name" autoFocus maxLength={24} value={value} onChange={event => setValue(event.target.value)} autoComplete="given-name" />
      <button type="submit">{t.enter}</button>
      <button type="button" onClick={() => setVisitor(t.visitorDefault)}>{t.skip}</button>
    </form>
  </dialog>
}
