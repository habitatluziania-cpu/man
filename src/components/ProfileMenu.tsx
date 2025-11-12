import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileMenuProps {
  isDarkMode?: boolean;
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isDarkMode = true, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAdminProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('full_name, email, profile_photo_url')
          .eq('id', user.id)
          .maybeSingle();

        if (adminData) {
          setAdminName(adminData.full_name);
          setAdminEmail(adminData.email);
          setProfilePhoto(adminData.profile_photo_url);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          const { error: bucketError } = await supabase.storage.createBucket('avatars', {
            public: true
          });

          if (!bucketError) {
            const { error: retryError } = await supabase.storage
              .from('avatars')
              .upload(filePath, file);

            if (retryError) throw retryError;
          } else {
            throw bucketError;
          }
        } else {
          throw uploadError;
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ profile_photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfilePhoto(publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={isDarkMode
          ? "flex items-center gap-2 p-1.5 hover:bg-zinc-800 rounded-md transition-all"
          : "flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-md transition-all"
        }
      >
        <div className="relative">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Perfil"
              className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-cyan-500">
              {getInitials(adminName)}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className={isDarkMode
          ? "absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50"
          : "absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
        }>
          <div className={isDarkMode ? "p-4 border-b border-zinc-800" : "p-4 border-b border-gray-200"}>
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Perfil"
                    className="w-20 h-20 rounded-full object-cover border-4 border-cyan-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-cyan-500">
                    {getInitials(adminName)}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  title="Alterar foto"
                >
                  {uploading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <p className={isDarkMode ? "font-semibold text-white text-sm" : "font-semibold text-gray-900 text-sm"}>{adminName}</p>
                <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-600"}>{adminEmail}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={onLogout}
              className={isDarkMode
                ? "w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-md transition-all text-sm"
                : "w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-all text-sm"
              }
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
