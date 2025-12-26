import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { create } from 'zustand'

// Define the Timer State interface
interface TimerState {
    [key: string]: {
        lastUpdated: number
        interval: number
        remaining: number
    }
}

const isBrowser = typeof window !== 'undefined'

export const useTimerStore = create<Partial<TimerState>>(() => ({}))

const getRemainingTimeFromStorage = (key: string, interval: number): number => {
    const storedData = localStorage.getItem(key)
    if (storedData && isBrowser) {
        const { lastUpdated, remaining } = JSON.parse(storedData)
        const elapsedTime = Date.now() - lastUpdated
        const updatedRemaining = remaining - elapsedTime
        return updatedRemaining > 0 ? updatedRemaining : 0
    }
    return interval * 1000
}

const useTimerZustand = (timerType: string, interval: number = 60) => {
    const key = useMemo<string>(() => {
        const storedKey = isBrowser && localStorage.getItem(`${timerType}-key`)
        if (storedKey) {
            return storedKey
        }
        const newKey = uuid()
        if (isBrowser) {
            localStorage.setItem(`${timerType}-key`, newKey)
        }
        return newKey
    }, [timerType])

    const [isExpired, setIsExpired] = useState<boolean>(false)
    const [timerStarted, setTimerStarted] = useState<boolean>(false)
    const [isTimerLoaded, setIsTimerLoaded] = useState<boolean>(false)

    const startTimer = () => {
        setTimerStarted(true)
        const remainingTime = interval * 1000

        useTimerStore.setState({
            [key]: {
                lastUpdated: Date.now(),
                interval: 1000,
                remaining: remainingTime,
            },
        })

        if (isBrowser) {
            localStorage.setItem(
                key,
                JSON.stringify({
                    lastUpdated: Date.now(),
                    remaining: remainingTime,
                })
            )
        }

        setIsExpired(false)
    }

    const resetTimer = () => {
        startTimer()
    }

    useEffect(() => {
        // Start as loading
        setIsTimerLoaded(true)

        const storedData = isBrowser ? localStorage.getItem(key) : null

        if (storedData) {
            const { lastUpdated, remaining } = JSON.parse(storedData)
            const elapsed = Date.now() - lastUpdated
            const updatedRemaining = remaining - elapsed

            if (updatedRemaining > 0) {
                useTimerStore.setState({
                    [key]: {
                        lastUpdated: Date.now(),
                        interval: 1000,
                        remaining: updatedRemaining,
                    },
                })
                setTimerStarted(true)
            } else {
                useTimerStore.setState({
                    [key]: {
                        lastUpdated: Date.now(),
                        interval: 1000,
                        remaining: 0,
                    },
                })
                setIsExpired(true)
            }
        }

        // FINISHED loading
        setIsTimerLoaded(false)
    }, [key])

    useEffect(() => {
        const timerState = useTimerStore.getState()[key]
        if (timerState?.remaining === 0) {
            setIsExpired(true)
        }
    }, [key])

    const remainingTime = useTimerStore((state) => state[key]?.remaining || 0)
    const remainingSeconds = Math.floor(remainingTime / 1000)

    useEffect(() => {
        if (timerStarted) {
            const intervalId = setInterval(() => {
                const currentState = useTimerStore.getState()
                const nextState: Partial<TimerState> = {}
                const now = Date.now()

                for (const key in currentState) {
                    const { lastUpdated, interval, remaining } =
                        currentState[key]!
                    const elapsedTime = now - lastUpdated
                    const updatedRemaining = remaining - elapsedTime

                    if (updatedRemaining <= 0) {
                        nextState[key] = {
                            lastUpdated: now,
                            interval,
                            remaining: 0,
                        }
                        setIsExpired(true)
                    } else {
                        nextState[key] = {
                            lastUpdated: now,
                            interval,
                            remaining: updatedRemaining,
                        }
                    }

                    localStorage.setItem(
                        key,
                        JSON.stringify({
                            lastUpdated: now,
                            remaining: updatedRemaining,
                        })
                    )
                }

                if (Object.keys(nextState).length > 0) {
                    useTimerStore.setState(nextState)
                }
            }, 1000)

            return () => clearInterval(intervalId)
        }
    }, [timerStarted])

    return {
        remainingSeconds,
        isExpired,
        isTimerLoaded,
        startTimer,
        resetTimer,
    }
}

export default useTimerZustand
