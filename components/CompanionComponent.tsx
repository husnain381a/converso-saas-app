'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, configureAssistant, getSubjectColor } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // 🎵 Control soundwave animation when assistant speaks
  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isSpeaking]);

  // 🎧 Handle all Vapi event listeners
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
      addToSessionHistory(companionId)
    };

    const onSpeechStart = () => {
      console.log('🎤 Assistant started speaking');
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log('🤫 Assistant stopped speaking');
      setIsSpeaking(false);
    };

    const onError = (error: Error) => console.error('⚠️ Error:', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    // 🧹 Clean up listeners
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  // 🎙️ Toggle user microphone
  const toggleMicrophone = () => {
    const muted = vapi.isMuted();
    vapi.setMuted(!muted);
    setIsMuted(!muted);
  };

  // 📞 Start voice session
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ['transcript' as const],
      serverMessages: [] as const,
    };

    try {
      // @ts-expect-error: safe runtime
      await vapi.start(configureAssistant(voice, style), assistantOverrides);
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // 🔴 End voice session
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    setIsSpeaking(false);
    vapi.stop();
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        {/* 🎓 AI Companion */}
        <div className="companion-section">
          <div
            className="companion-avatar relative"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            {/* Default icon */}
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? 'opacity-100'
                  : 'opacity-0',
                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            {/* Lottie Soundwave Animation */}
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                loop
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl mt-2">{name}</p>
        </div>

        {/* 🧑 User Side */}
        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>

          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
          </button>

          <button
            className={cn(
              'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
              callStatus === CallStatus.ACTIVE
                ? 'bg-red-700'
                : 'bg-primary',
              callStatus === CallStatus.CONNECTING && 'animate-pulse'
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? 'End Session'
              : callStatus === CallStatus.CONNECTING
              ? 'Connecting...'
              : 'Start Session'}
          </button>
        </div>
      </section>

      {/* 💬 Transcript Section */}
      <section className="transcript mt-4">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) =>
            message.role === 'assistant' ? (
              <p key={index} className="max-sm:text-sm">
                {name.split(' ')[0].replace(/[.,]/g, ',')}: {message.content}
              </p>
            ) : (
              <p key={index} className="text-primary max-sm:text-sm">
                {userName}: {message.content}
              </p>
            )
          )}
        </div>
        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
