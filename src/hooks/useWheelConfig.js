import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/*
  Required Supabase tables:

  wheel_segments:
    id uuid PK, label text, color text, probability numeric,
    image_url text, display_order int

  wheel_config:
    id uuid PK, background_image text, logo_image text,
    show_store_buttons bool, apple_store_url text, google_play_url text,
    spin_button_text text, spin_button_color text,
    wheel_border_color text, wheel_center_color text

  wheel_popup_config:
    id uuid PK, background_image text, background_color text,
    win_title text, win_message text (use {reward} as placeholder),
    button_text text, button_url text, button_color text
*/

const FALLBACK_SEGMENTS = [
  { id: 1, label: '500 DF',    color: '#22c55e', probability: 10, image_url: null, display_order: 0 },
  { id: 2, label: 'Try Again', color: '#111111', probability: 30, image_url: null, display_order: 1 },
  { id: 3, label: '1000 DF',   color: '#22c55e', probability: 5,  image_url: null, display_order: 2 },
  { id: 4, label: 'Try Again', color: '#111111', probability: 30, image_url: null, display_order: 3 },
  { id: 5, label: '200 DF',    color: '#22c55e', probability: 15, image_url: null, display_order: 4 },
  { id: 6, label: 'Try Again', color: '#111111', probability: 30, image_url: null, display_order: 5 },
  { id: 7, label: '5000 DF',   color: '#22c55e', probability: 1,  image_url: null, display_order: 6 },
  { id: 8, label: 'Try Again', color: '#111111', probability: 30, image_url: null, display_order: 7 },
]

const FALLBACK_CONFIG = {
  background_image:   null,
  logo_image:         null,
  show_store_buttons: false,
  apple_store_url:    '#',
  google_play_url:    '#',
  spin_button_text:   'SPIN',
  spin_button_color:  '#22c55e',
  wheel_border_color: '#ffffff',
  wheel_center_color: '#ffffff',
}

const FALLBACK_POPUP = {
  background_image: null,
  background_color: '#111827',
  win_title:        'You Won!',
  win_message:      'Congratulations! You have won {reward}!',
  button_text:      'Claim Reward',
  button_url:       null,
  button_color:     '#22c55e',
}

export function useWheelConfig() {
  const [segments, setSegments] = useState(FALLBACK_SEGMENTS)
  const [config,   setConfig]   = useState(FALLBACK_CONFIG)
  const [popup,    setPopup]    = useState(FALLBACK_POPUP)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('wheel_segments').select('*').order('display_order'),
      supabase.from('wheel_config').select('*').limit(1).maybeSingle(),
      supabase.from('wheel_popup_config').select('*').limit(1).maybeSingle(),
    ]).then(([segRes, cfgRes, popRes]) => {
      if (!segRes.error && segRes.data?.length) setSegments(segRes.data)
      if (!cfgRes.error && cfgRes.data)          setConfig(p => ({ ...p, ...cfgRes.data }))
      if (!popRes.error && popRes.data)           setPopup(p => ({ ...p, ...popRes.data }))
    }).finally(() => setLoading(false))
  }, [])

  return { segments, config, popup, loading }
}
