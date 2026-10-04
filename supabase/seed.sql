-- =============================================================================
-- FIF AWARDS 2026 — Données de départ
-- À exécuter après la migration initiale. Peut être rejoué sans doublon.
-- =============================================================================

-- Les quatre distinctions d'honneur 2026
insert into public.categories (slug, nom, description, ordre) values
  (
    'metiers-talents-techniques',
    'Métiers et Talents Techniques du Cinéma',
    'Réalisateurs, scénaristes, producteurs, directeurs de la photographie, cadreurs, monteurs, ingénieurs du son, costumiers, maquilleurs, décorateurs : celles et ceux qui fabriquent les films.',
    1
  ),
  (
    'pionniers-cinema-guineen-africain',
    'Pionniers du Cinéma Guinéen et Africain',
    'Hommage aux figures qui ont ouvert la voie et bâti l''histoire du cinéma guinéen et africain.',
    2
  ),
  (
    'bravoure-leadership-feminin',
    'Bravoure & Leadership Féminin dans le Cinéma Africain',
    'Distinction des femmes qui portent, dirigent et transforment le cinéma africain.',
    3
  ),
  (
    'institutions-mecenes-medias',
    'Institutions, Mécènes & Médias au Service du Cinéma',
    'Reconnaissance des institutions, mécènes et médias qui soutiennent et font rayonner le septième art.',
    4
  )
on conflict (slug) do nothing;

-- Première actualité (publiée)
insert into public.actualites (slug, titre, date_publication, texte, statut) values
  (
    'quatre-distinctions-honneur-2026',
    'FIF AWARDS 2026 : les quatre distinctions d''honneur',
    '2026-10-04',
    'Pour sa 4ᵉ édition, les 19 et 20 novembre 2026 au Radisson Blu de Conakry, le FIF AWARDS met à l''honneur quatre distinctions : Métiers et Talents Techniques du Cinéma ; Pionniers du Cinéma Guinéen et Africain ; Bravoure & Leadership Féminin dans le Cinéma Africain ; Institutions, Mécènes & Médias au Service du Cinéma.

Les distingués 2026 sont choisis par le Comité d''Organisation. Leurs noms seront publiés sur ce site avant la cérémonie, lors d''une annonce publique.',
    'publie'
  )
on conflict (slug) do nothing;
