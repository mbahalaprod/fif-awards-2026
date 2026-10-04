-- =============================================================================
-- FIF AWARDS 2026 — Schéma initial
-- -----------------------------------------------------------------------------
-- À exécuter une fois sur un projet Supabase neuf (SQL Editor ou `supabase db push`).
-- Voir docs/SUPABASE.md pour la procédure complète.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Utilitaires
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Administrateurs (comptes créés par un administrateur, jamais d'inscription)
-- -----------------------------------------------------------------------------

create table public.administrateurs (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'editeur' check (role in ('admin', 'editeur')),
  created_at timestamptz not null default now()
);

-- security definer : lit la table sans repasser par ses propres règles RLS.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.administrateurs where user_id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.administrateurs where user_id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Paramètres du site (une seule ligne, id = 1)
-- -----------------------------------------------------------------------------

create table public.parametres (
  id                      int primary key default 1 check (id = 1),
  vote_actif              boolean not null default false,
  candidatures_ouvertes   boolean not null default true,
  distingues_visibles     boolean not null default false,
  candidatures_ouverture  date,
  candidatures_cloture    date,
  slogan                  text not null default 'Célébrer toute la chaîne de valeur du cinéma guinéen',
  telephone               text,
  email                   text,
  whatsapp                text,
  adresse                 text not null default 'Radisson Blu Hôtel, Conakry, Guinée',
  facebook_url            text,
  instagram_url           text,
  youtube_url             text,
  tiktok_url              text,
  linkedin_url            text,
  updated_at              timestamptz not null default now()
);

insert into public.parametres (id) values (1);

create trigger parametres_updated_at before update on public.parametres
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Contenus publics
-- -----------------------------------------------------------------------------

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  nom         text not null,
  description text not null default '',
  ordre       int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create table public.distingues (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  nom_complet  text not null,
  categorie_id uuid not null references public.categories (id) on delete restrict,
  metier       text,
  citation     text,
  biographie   text,
  photo_url    text,
  statut       text not null default 'brouillon' check (statut in ('brouillon', 'publie')),
  ordre        int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index distingues_categorie_idx on public.distingues (categorie_id);

create trigger distingues_updated_at before update on public.distingues
  for each row execute function public.set_updated_at();

create table public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  palier      text not null check (palier in ('platine', 'or', 'argent', 'bronze')),
  description text,
  logo_url    text,
  site_url    text,
  ordre       int not null default 0,
  statut      text not null default 'brouillon' check (statut in ('brouillon', 'publie')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger sponsors_updated_at before update on public.sponsors
  for each row execute function public.set_updated_at();

create table public.actualites (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  titre            text not null,
  date_publication date not null default current_date,
  texte            text not null default '',
  image_url        text,
  statut           text not null default 'brouillon' check (statut in ('brouillon', 'publie')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger actualites_updated_at before update on public.actualites
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Données envoyées par le public (insérées uniquement par le serveur)
-- -----------------------------------------------------------------------------

create table public.candidatures (
  id              uuid primary key default gen_random_uuid(),
  nom             text not null,
  email           text not null,
  telephone       text not null,
  categorie_id    uuid references public.categories (id) on delete set null,
  oeuvre_parcours text not null,
  lien            text,
  message         text,
  statut          text not null default 'nouvelle'
                  check (statut in ('nouvelle', 'en_cours', 'retenue', 'refusee')),
  ip_hash         text,
  created_at      timestamptz not null default now()
);

create index candidatures_created_idx on public.candidatures (created_at desc);

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  nom        text not null,
  email      text not null,
  sujet      text not null,
  texte      text not null,
  lu         boolean not null default false,
  ip_hash    text,
  created_at timestamptz not null default now()
);

create index messages_created_idx on public.messages (created_at desc);

create table public.reservations (
  id             uuid primary key default gen_random_uuid(),
  nom            text not null,
  telephone      text,
  email          text,
  nombre_places  int not null check (nombre_places between 1 and 10),
  type_billet    text,
  statut         text not null default 'en_attente'
                 check (statut in ('en_attente', 'confirmee', 'annulee')),
  ip_hash        text,
  created_at     timestamptz not null default now(),
  check (telephone is not null or email is not null)
);

create index reservations_created_idx on public.reservations (created_at desc);

-- -----------------------------------------------------------------------------
-- Vote du public (désactivé pour l'édition 2026, conservé pour plus tard)
-- -----------------------------------------------------------------------------

create table public.votes (
  id           uuid primary key default gen_random_uuid(),
  email_hash   text not null,
  categorie_id uuid not null references public.categories (id) on delete cascade,
  distingue_id uuid not null references public.distingues (id) on delete cascade,
  ip_hash      text,
  created_at   timestamptz not null default now(),
  unique (email_hash, categorie_id)
);

create table public.codes_otp (
  id         uuid primary key default gen_random_uuid(),
  email_hash text not null,
  code_hash  text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index codes_otp_email_idx on public.codes_otp (email_hash);

-- =============================================================================
-- Sécurité au niveau des lignes (RLS)
-- =============================================================================

alter table public.administrateurs enable row level security;
alter table public.parametres      enable row level security;
alter table public.categories      enable row level security;
alter table public.distingues      enable row level security;
alter table public.sponsors        enable row level security;
alter table public.actualites      enable row level security;
alter table public.candidatures    enable row level security;
alter table public.messages        enable row level security;
alter table public.reservations    enable row level security;
alter table public.votes           enable row level security;
alter table public.codes_otp       enable row level security;

-- Administrateurs : chacun voit sa propre ligne, l'admin voit et gère tout.
create policy "administrateurs_lecture" on public.administrateurs
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "administrateurs_gestion" on public.administrateurs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Paramètres : lecture publique, modification réservée aux administrateurs.
create policy "parametres_lecture" on public.parametres
  for select to anon, authenticated using (true);
create policy "parametres_modification" on public.parametres
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Catégories : lecture publique, modification par l'équipe.
create policy "categories_lecture" on public.categories
  for select to anon, authenticated using (true);
create policy "categories_gestion" on public.categories
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Distingués : le public ne voit que les fiches publiées, et seulement si
-- l'interrupteur « distingues_visibles » est allumé.
create policy "distingues_lecture_publique" on public.distingues
  for select to anon, authenticated
  using (
    statut = 'publie'
    and (select distingues_visibles from public.parametres where id = 1)
  );
create policy "distingues_lecture_equipe" on public.distingues
  for select to authenticated using (public.is_staff());
create policy "distingues_gestion" on public.distingues
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Sponsors et actualités : publiés pour le public, tout pour l'équipe.
create policy "sponsors_lecture_publique" on public.sponsors
  for select to anon, authenticated using (statut = 'publie');
create policy "sponsors_gestion" on public.sponsors
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "actualites_lecture_publique" on public.actualites
  for select to anon, authenticated using (statut = 'publie');
create policy "actualites_gestion" on public.actualites
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Candidatures, messages, réservations : aucune lecture publique.
-- L'insertion passe par le serveur (clé de service), qui applique l'anti-abus.
create policy "candidatures_equipe" on public.candidatures
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "messages_equipe" on public.messages
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "reservations_equipe" on public.reservations
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Votes et codes OTP : aucune règle, donc accessibles seulement via la clé de service.

-- =============================================================================
-- Stockage des images (bucket public en lecture, écriture réservée à l'équipe)
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medias',
  'medias',
  true,
  5242880, -- 5 Mo
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "medias_lecture_equipe" on storage.objects
  for select to authenticated
  using (bucket_id = 'medias' and public.is_staff());
create policy "medias_ajout_equipe" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'medias' and public.is_staff());
create policy "medias_modification_equipe" on storage.objects
  for update to authenticated
  using (bucket_id = 'medias' and public.is_staff());
create policy "medias_suppression_equipe" on storage.objects
  for delete to authenticated
  using (bucket_id = 'medias' and public.is_staff());
