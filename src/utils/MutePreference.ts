function isMuted() {
    const storage = localStorage.getItem('mutePreference');
    return storage === 'true'; // Return true if storage is 'true', otherwise false
}

function setMute(state: boolean) {
    localStorage.setItem('mutePreference', state.toString());

    window.dispatchEvent(new CustomEvent('mutePreferenceChanged'));
}

function onMuteChange(callback: () => void) {
    window.addEventListener('mutePreferenceChanged', callback);
}

function offMuteChange(callback: () => void) {
    window.removeEventListener('mutePreferenceChanged', callback);
}

export default {
    isMuted,
    setMute,
    onMuteChange,
    offMuteChange,
};
