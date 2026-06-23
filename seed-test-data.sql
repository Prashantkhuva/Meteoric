-- =============================================================
-- Meteoric Admin — Test Data Seed
-- All PKs are `bigint generated always as identity`,
-- so we use subqueries to resolve foreign key references.
-- Run in Supabase SQL Editor (Dashboard > SQL Editor).
-- =============================================================

-- ── LEADS (25 records) ──
INSERT INTO leads (name, email, phone, company, services, budget, status, created_at) VALUES
('Sarah Chen',     'sarah.chen@email.com',    '+1-415-555-0101', 'Finlytix',          'Full SaaS Development',          '$50k-$80k',  'inquiry',     NOW() - INTERVAL '45 days'),
('Marcus Johnson', 'marcus.j@email.com',     '+1-212-555-0102', 'LaunchBright',      'Landing Page + CMS',             '$10k-$15k',  'discovery',   NOW() - INTERVAL '38 days'),
('Priya Patel',    'priya.p@email.com',      '+91-98765-54321', 'Stellar Labs',      'Web App Redesign',               '$25k-$40k',  'proposal',    NOW() - INTERVAL '30 days'),
('Tom Williams',   'tom.w@email.com',        '+44-7700-900123', 'GreenLeaf Energy',  'E-commerce Platform',            '$60k-$100k', 'in_progress', NOW() - INTERVAL '25 days'),
('Emily Davis',    'emily.d@email.com',      '+1-310-555-0104', 'Davis & Co',        'Brand Website',                  '$8k-$12k',   'completed',   NOW() - INTERVAL '20 days'),
('Alex Kim',       'alex.kim@email.com',     '+82-10-5555-6789','Seoul Digital',     'SaaS MVP',                       '$30k-$50k',  'lost',        NOW() - INTERVAL '18 days'),
('Lisa Andersson', 'lisa.a@email.com',        '+46-70-555-0105', 'Nordic Health',     'Healthcare Portal',              '$40k-$70k',  'inquiry',     NOW() - INTERVAL '15 days'),
('James Wilson',   'james.w@email.com',       '+1-617-555-0106', 'Wilson Realty',     'Real Estate Platform',           '$20k-$35k',  'discovery',   NOW() - INTERVAL '12 days'),
('Aisha Rahman',   'aisha.r@email.com',       '+60-12-555-7890', 'TechMaya',          'Mobile App Backend',             '$15k-$25k',  'proposal',    NOW() - INTERVAL '10 days'),
('Ryan O''Brien',  'ryan.o@email.com',        '+353-85-555-0107','O''Brien Consulting','Professional Services Site',    '$5k-$8k',    'inquiry',     NOW() - INTERVAL '8 days'),
('Maria Garcia',   'maria.g@email.com',       '+34-612-555-0108','Madrid Tech',       'Dashboard + Analytics',          '$35k-$55k',  'discovery',   NOW() - INTERVAL '7 days'),
('Kenji Tanaka',   'kenji.t@email.com',       '+81-90-5555-0109','Tokyo Ventures',    'API Integration Platform',       '$45k-$75k',  'in_progress', NOW() - INTERVAL '6 days'),
('Olivia Brown',   'olivia.b@email.com',      '+1-512-555-0110', 'Brown Design',      'Portfolio Website',              '$3k-$6k',    'completed',   NOW() - INTERVAL '5 days'),
('Daniel Müller',  'daniel.m@email.com',      '+49-170-555-0111','Berlin Startup Hub','Community Platform',             '$20k-$30k',  'lost',        NOW() - INTERVAL '4 days'),
('Sophie Laurent', 'sophie.l@email.com',      '+33-6-55-55-0112','Maison Laurent',    'Luxury Brand Site',              '$12k-$18k',  'inquiry',     NOW() - INTERVAL '3 days'),
('Carlos Silva',   'carlos.s@email.com',      '+55-11-95555-0113','Silva Tech',       'CRM System',                     '$25k-$45k',  'proposal',    NOW() - INTERVAL '2 days'),
('Emma Thompson',  'emma.t@email.com',        '+1-206-555-0114', 'Thompson Media',    'Content Platform',               '$15k-$22k',  'discovery',   NOW() - INTERVAL '1 day'),
('Rajesh Kumar',   'rajesh.k@email.com',      '+91-98100-55501','Kumar Enterprises', 'Inventory Management System',    '$30k-$50k',  'inquiry',     NOW()),
('Hannah Lee',     'hannah.l@email.com',      '+1-808-555-0115', 'Island Creative',   'Booking Platform',               '$18k-$28k',  'in_progress', NOW()),
('Fatima Al-Sayed','fatima.a@email.com',       '+971-50-555-0116','AlSayed Group',    'Corporate Portal',               '$40k-$60k',  'proposal',    NOW()),
('Nathan Brooks',  'nathan.b@email.com',       '+1-303-555-0117', 'Brooks & Partners','Legal Practice Website',         '$7k-$10k',   'inquiry',     NOW()),
('Yuki Nakamura',  'yuki.n@email.com',         '+81-80-5555-0118','Nakamura Design',  'Creative Agency Site',           '$8k-$14k',   'discovery',   NOW()),
('Chloe Martin',   'chloe.m@email.com',        '+1-416-555-0119', 'Martin Ventures',   'Investor Dashboard',             '$35k-$55k',  'lost',        NOW()),
('Arjun Mehta',    'arjun.m@email.com',        '+1-650-555-0120', 'Mehta AI Labs',     'AI Product Landing Page',        '$10k-$18k',  'in_progress', NOW()),
('Isabella Rossi', 'isabella.r@email.com',     '+39-335-555-0121','Rossi Design',     'Fashion E-commerce',             '$22k-$38k',  'inquiry',     NOW());

-- ── CLIENTS (10 records) ──
INSERT INTO clients (name, email, phone, company, status, created_at) VALUES
('Finlytix',          'hello@finlytix.io',         '+1-415-555-0201', 'Finlytix Inc',      'active',     NOW() - INTERVAL '90 days'),
('LaunchBright',      'team@launchbright.co',       '+1-212-555-0202', 'LaunchBright LLC',  'active',     NOW() - INTERVAL '75 days'),
('Stellar Labs',      'contact@stellarlabs.io',    '+1-310-555-0203', 'Stellar Labs Inc',  'onboarding', NOW() - INTERVAL '45 days'),
('GreenLeaf Energy',  'info@greenleaf.energy',     '+44-7700-900456', 'GreenLeaf Ltd',     'active',     NOW() - INTERVAL '60 days'),
('Nordic Health',     'hello@nordichealth.se',     '+46-70-555-0204', 'Nordic Health AB',  'at_risk',    NOW() - INTERVAL '30 days'),
('Tokyo Ventures',    'ventures@tokyo.vc',         '+81-90-5555-0205','Tokyo Ventures KK', 'onboarding', NOW() - INTERVAL '15 days'),
('Berlin Startup Hub','info@berlinstartup.hub',    '+49-170-555-0206','BSH GmbH',          'active',     NOW() - INTERVAL '20 days'),
('Maison Laurent',    'bonjour@maisonlaurent.fr',  '+33-6-55-55-0207','Maison Laurent SA', 'inactive',   NOW() - INTERVAL '10 days'),
('AlSayed Group',     'info@alsayedgroup.ae',      '+971-50-555-0208','AlSayed Group LLC', 'active',     NOW() - INTERVAL '5 days'),
('Mehta AI Labs',     'hello@mehtaai.com',         '+1-650-555-0209', 'Mehta AI Labs Inc', 'churned',    NOW() - INTERVAL '120 days');

-- ── PROPOSALS (12 records) ──
DO $$
DECLARE
  lid int;
BEGIN
  SELECT id INTO lid FROM leads WHERE email = 'sarah.chen@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Finlytix Platform — Full SaaS Development',  'accepted', '{"scope":"Full SaaS platform including dashboard, analytics, and billing modules"}',   '[{"item":"Architecture & Setup","amount":8000},{"item":"Frontend Development","amount":25000},{"item":"Backend & API","amount":22000},{"item":"Testing & Deployment","amount":5000}]',   '10 weeks', 'Net 60', NOW() - INTERVAL '40 days');

  SELECT id INTO lid FROM leads WHERE email = 'marcus.j@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'LaunchBright — Landing Page + CMS',            'accepted', '{"scope":"Marketing landing page with headless CMS integration"}',                        '[{"item":"Design","amount":3000},{"item":"Frontend","amount":5000},{"item":"CMS Integration","amount":2000},{"item":"SEO Setup","amount":1000}]',                    '3 weeks',  'Net 30', NOW() - INTERVAL '32 days');

  SELECT id INTO lid FROM leads WHERE email = 'priya.p@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Stellar Labs — Web App Redesign',              'sent',     '{"scope":"Complete redesign of SaaS dashboard with new component system"}',              '[{"item":"UI Audit & Planning","amount":4000},{"item":"Design System","amount":8000},{"item":"Frontend Rebuild","amount":18000},{"item":"Migration","amount":4000}]',    '8 weeks',  'Net 30', NOW() - INTERVAL '25 days');

  SELECT id INTO lid FROM leads WHERE email = 'tom.w@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'GreenLeaf — E-commerce Platform',              'draft',    '{"scope":"Custom e-commerce solution with subscription management"}',                    '[{"item":"Platform Architecture","amount":10000},{"item":"Storefront","amount":20000},{"item":"Payment Integration","amount":8000},{"item":"Admin Dashboard","amount":12000}]', '12 weeks', 'Net 60', NOW() - INTERVAL '20 days');

  SELECT id INTO lid FROM leads WHERE email = 'emily.d@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Davis & Co — Brand Website',                  'accepted', '{"scope":"Professional brand website with blog and case studies"}',                        '[{"item":"Design","amount":2500},{"item":"Development","amount":4000},{"item":"Content Migration","amount":1500},{"item":"Launch Support","amount":500}]',              '4 weeks',  'Net 30', NOW() - INTERVAL '15 days');

  SELECT id INTO lid FROM leads WHERE email = 'alex.kim@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Seoul Digital — SaaS MVP',                    'rejected', '{"scope":"MVP build for AI-powered analytics tool"}',                                     '[{"item":"MVP Planning","amount":5000},{"item":"Core Development","amount":20000},{"item":"Basic UI","amount":8000},{"item":"Deployment","amount":2000}]',             '6 weeks',  'Net 30', NOW() - INTERVAL '12 days');

  SELECT id INTO lid FROM leads WHERE email = 'lisa.a@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Nordic Health — Patient Portal',              'sent',     '{"scope":"Secure patient portal with appointment scheduling"}',                           '[{"item":"Security Audit","amount":3000},{"item":"Portal Dev","amount":18000},{"item":"Integration","amount":7000},{"item":"Compliance","amount":4000}]',             '8 weeks',  'Net 45', NOW() - INTERVAL '10 days');

  SELECT id INTO lid FROM leads WHERE email = 'james.w@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Wilson Realty — Real Estate Platform',        'draft',    '{"scope":"Property listing platform with virtual tour integration"}',                     '[{"item":"Platform Design","amount":5000},{"item":"Frontend","amount":12000},{"item":"Backend","amount":10000},{"item":"Tour Integration","amount":3000}]',           '7 weeks',  'Net 30', NOW() - INTERVAL '8 days');

  SELECT id INTO lid FROM leads WHERE email = 'aisha.r@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'TechMaya — Mobile Backend',                   'viewed',   '{"scope":"RESTful backend for mobile application"}',                                      '[{"item":"API Design","amount":3000},{"item":"Backend Dev","amount":10000},{"item":"Database Setup","amount":3000},{"item":"Documentation","amount":2000}]',          '5 weeks',  'Net 30', NOW() - INTERVAL '6 days');

  SELECT id INTO lid FROM leads WHERE email = 'ryan.o@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'O''Brien Consulting — Professional Site',     'draft',    '{"scope":"Professional consulting website with booking"}',                                '[{"item":"Design","amount":2000},{"item":"Development","amount":3000},{"item":"Booking Integration","amount":1000}]',                                                '3 weeks',  'Net 15', NOW() - INTERVAL '4 days');

  SELECT id INTO lid FROM leads WHERE email = 'maria.g@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Madrid Tech — Analytics Dashboard',           'sent',     '{"scope":"Interactive analytics dashboard with real-time data"}',                         '[{"item":"Dashboard Design","amount":5000},{"item":"Frontend","amount":15000},{"item":"Data Pipeline","amount":10000},{"item":"Testing","amount":3000}]',             '8 weeks',  'Net 30', NOW() - INTERVAL '2 days');

  SELECT id INTO lid FROM leads WHERE email = 'kenji.t@email.com';
  INSERT INTO proposals (lead_id, title, status, content, pricing, timeline, terms, created_at) VALUES
  (lid, 'Tokyo Ventures — API Integration Platform',   'draft',    '{"scope":"API gateway and integration middleware platform"}',                             '[{"item":"Architecture","amount":8000},{"item":"Gateway Dev","amount":20000},{"item":"Integration SDK","amount":12000},{"item":"Documentation","amount":3000}]',   '10 weeks', 'Net 60', NOW());
END $$;

-- ── INVOICES (15 records) ──
DO $$
DECLARE
  cid int;
  pid int;
BEGIN
  -- INV-0001: Finlytix milestone 1 (paid)
  SELECT id INTO cid FROM clients WHERE email = 'hello@finlytix.io';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Finlytix Platform%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0001', 'paid', '[{"description":"SaaS Platform — Milestone 1","quantity":1,"rate":15000}]', 15000.00, 1500.00, 16500.00, 'Payment for milestone 1', 'Net 30', CURRENT_DATE - INTERVAL '60 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '55 days');

  -- INV-0002: Finlytix milestone 2 (paid)
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0002', 'paid', '[{"description":"SaaS Platform — Milestone 2","quantity":1,"rate":20000}]', 20000.00, 2000.00, 22000.00, 'Payment for milestone 2', 'Net 30', CURRENT_DATE - INTERVAL '30 days', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', NOW() - INTERVAL '28 days');

  -- INV-0003: LaunchBright full payment (paid)
  SELECT id INTO cid FROM clients WHERE email = 'team@launchbright.co';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'LaunchBright%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0003', 'paid', '[{"description":"Landing Page + CMS — Full Payment","quantity":1,"rate":11000}]', 11000.00, 1100.00, 12100.00, 'Full project payment with 10% discount applied', 'Net 15', CURRENT_DATE - INTERVAL '45 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '40 days');

  -- INV-0004: Stellar Labs design phase (sent)
  SELECT id INTO cid FROM clients WHERE email = 'contact@stellarlabs.io';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Stellar Labs%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0004', 'sent', '[{"description":"UI Audit & Planning","quantity":1,"rate":4000},{"description":"Design System Setup","quantity":1,"rate":8000}]', 12000.00, 1200.00, 13200.00, 'Initial design phase', 'Net 30', CURRENT_DATE + INTERVAL '15 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NULL);

  -- INV-0005: GreenLeaf architecture (draft)
  SELECT id INTO cid FROM clients WHERE email = 'info@greenleaf.energy';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'GreenLeaf%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0005', 'draft', '[{"description":"Platform Architecture","quantity":1,"rate":10000},{"description":"Initial Storefront","quantity":1,"rate":5000}]', 15000.00, 1500.00, 16500.00, 'Architecture & initial build', 'Net 60', CURRENT_DATE + INTERVAL '30 days', NOW() - INTERVAL '2 days', NULL, NULL);

  -- INV-0006: Davis & Co full payment (paid)
  SELECT id INTO cid FROM clients WHERE email = 'hello@nordichealth.se';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Davis%Co%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0006', 'paid', '[{"description":"Brand Website — Full Payment","quantity":1,"rate":8500}]', 8500.00, 850.00, 9350.00, NULL, 'Net 30', CURRENT_DATE - INTERVAL '20 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '18 days');

  -- INV-0007: LaunchBright retainer (overdue)
  SELECT id INTO cid FROM clients WHERE email = 'team@launchbright.co';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'LaunchBright%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0007', 'overdue', '[{"description":"Monthly Maintenance Retainer — June","quantity":1,"rate":2000}]', 2000.00, 200.00, 2200.00, 'Monthly retainer for ongoing support', 'Net 15', CURRENT_DATE - INTERVAL '20 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NULL);

  -- INV-0008: Finlytix milestone 3 (overdue)
  SELECT id INTO cid FROM clients WHERE email = 'hello@finlytix.io';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0008', 'overdue', '[{"description":"SaaS Platform — Milestone 3","quantity":1,"rate":25000}]', 25000.00, 2500.00, 27500.00, 'Final milestone payment — overdue', 'Net 30', CURRENT_DATE - INTERVAL '10 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NULL);

  -- INV-0009: Berlin Startup Hub patient portal phase 1 (sent)
  SELECT id INTO cid FROM clients WHERE email = 'info@berlinstartup.hub';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Nordic Health%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0009', 'sent', '[{"description":"Patient Portal — Phase 1","quantity":1,"rate":12000}]', 12000.00, 1200.00, 13200.00, 'Phase 1: security & core portal', 'Net 45', CURRENT_DATE + INTERVAL '25 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NULL);

  -- INV-0010: Stellar Labs frontend rebuild (draft)
  SELECT id INTO cid FROM clients WHERE email = 'contact@stellarlabs.io';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0010', 'draft', '[{"description":"Frontend Rebuild","quantity":1,"rate":18000}]', 18000.00, 1800.00, 19800.00, 'Full frontend rebuild phase', 'Net 30', CURRENT_DATE + INTERVAL '45 days', NOW(), NULL, NULL);

  -- INV-0011: GreenLeaf payment integration research (cancelled)
  SELECT id INTO cid FROM clients WHERE email = 'info@greenleaf.energy';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0011', 'cancelled', '[{"description":"Payment Integration Research","quantity":1,"rate":3000}]', 3000.00, 300.00, 3300.00, 'Cancelled — scope changed', 'Net 30', CURRENT_DATE - INTERVAL '5 days', NOW() - INTERVAL '15 days', NULL, NULL);

  -- INV-0012: Nordic Health annual hosting (sent)
  SELECT id INTO cid FROM clients WHERE email = 'hello@nordichealth.se';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0012', 'sent', '[{"description":"Annual Hosting & Maintenance","quantity":1,"rate":2400}]', 2400.00, 240.00, 2640.00, 'Annual renewal', 'Net 30', CURRENT_DATE + INTERVAL '10 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL);

  -- INV-0013: Tokyo Ventures MVP planning (draft)
  SELECT id INTO cid FROM clients WHERE email = 'ventures@tokyo.vc';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Seoul Digital%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0013', 'draft', '[{"description":"MVP Planning & Prototype","quantity":1,"rate":5000}]', 5000.00, 500.00, 5500.00, 'Initial planning phase', 'Net 30', CURRENT_DATE + INTERVAL '60 days', NOW() - INTERVAL '1 day', NULL, NULL);

  -- INV-0014: Maison Laurent design sprint (draft)
  SELECT id INTO cid FROM clients WHERE email = 'bonjour@maisonlaurent.fr';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'Wilson Realty%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0014', 'draft', '[{"description":"Platform Design Sprint","quantity":1,"rate":5000}]', 5000.00, 500.00, 5500.00, 'Design sprint for real estate platform', 'Net 30', CURRENT_DATE + INTERVAL '14 days', NOW(), NULL, NULL);

  -- INV-0015: AlSayed Group API design (draft)
  SELECT id INTO cid FROM clients WHERE email = 'info@alsayedgroup.ae';
  SELECT id INTO pid FROM proposals WHERE title LIKE 'TechMaya%';
  INSERT INTO invoices (client_id, proposal_id, invoice_number, status, items, subtotal, tax, total, notes, terms, due_date, created_at, sent_at, paid_at) VALUES
  (cid, pid, 'INV-0015', 'draft', '[{"description":"API Design & Documentation","quantity":1,"rate":5000}]', 5000.00, 500.00, 5500.00, 'Initial API phase', 'Net 30', CURRENT_DATE + INTERVAL '20 days', NOW(), NULL, NULL);
END $$;

-- ── PROJECTS (8 records) ──
DO $$
DECLARE
  cid int;
BEGIN
  SELECT id INTO cid FROM clients WHERE email = 'hello@finlytix.io';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'Finlytix SaaS Platform',         'Full-stack SaaS platform with analytics dashboard, subscription billing, and team collaboration features', 'in_progress', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '30 days',  60000.00, 'Full Stack Development, SaaS Architecture',       'Client uses React + Node.js stack',                          NOW() - INTERVAL '80 days');

  SELECT id INTO cid FROM clients WHERE email = 'team@launchbright.co';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'LaunchBright Marketing Site',     'Modern landing page with headless CMS, blog, and lead capture system',                                    'completed',   CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '15 days', 11000.00, 'Frontend, CMS Integration, SEO',                   'Deployed to Vercel. Client very happy with performance.',    NOW() - INTERVAL '70 days');

  SELECT id INTO cid FROM clients WHERE email = 'contact@stellarlabs.io';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'Stellar Labs Dashboard Redesign','Complete redesign of analytics dashboard with new component library',                                   'planning',    CURRENT_DATE + INTERVAL '5 days',  CURRENT_DATE + INTERVAL '60 days',  34000.00, 'UI/UX Design, Frontend, Design System',            'Awaiting design approval before starting development.',     NOW() - INTERVAL '40 days');

  SELECT id INTO cid FROM clients WHERE email = 'info@greenleaf.energy';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'GreenLeaf E-commerce Platform',  'Custom e-commerce solution with subscription management, inventory tracking, and global shipping',         'planning',    CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '90 days',  50000.00, 'E-commerce, Payment Integration, Backend',          'Client needs PCI compliance. Discussing Stripe vs Braintree.', NOW() - INTERVAL '30 days');

  SELECT id INTO cid FROM clients WHERE email = 'hello@nordichealth.se';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'Davis & Co Brand Website',       'Professional brand site with case studies, blog, and contact/booking system',                              'completed',   CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '5 days',  8500.00,  'Design, Development, CMS',                         'Clean project — on time, on budget.',                        NOW() - INTERVAL '40 days');

  SELECT id INTO cid FROM clients WHERE email = 'info@berlinstartup.hub';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'Nordic Health Patient Portal',   'Secure patient portal with appointment scheduling, medical records, and video consultation',               'review',      CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '40 days',  32000.00, 'Full Stack, Security, Integration',                'Security audit passed. Awaiting final compliance sign-off.', NOW() - INTERVAL '30 days');

  SELECT id INTO cid FROM clients WHERE email = 'info@alsayedgroup.ae';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'AlSayed Corporate Portal',       'Internal corporate portal with document management, HR tools, and analytics',                              'on_hold',     CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '45 days',  50000.00, 'Full Stack, Document Management, Analytics',       'Client paused due to internal restructuring.',               NOW() - INTERVAL '15 days');

  SELECT id INTO cid FROM clients WHERE email = 'hello@mehtaai.com';
  INSERT INTO projects (client_id, name, description, status, start_date, deadline, budget, services, notes, created_at) VALUES
  (cid, 'Mehta AI Landing Page',          'AI product landing page with interactive demo, waitlist, and blog',                                       'cancelled',   CURRENT_DATE - INTERVAL '5 days',  CURRENT_DATE + INTERVAL '20 days',  15000.00, 'Frontend, Interactive UI, Blog',                   'Client pivoted business model. Project cancelled.',          NOW() - INTERVAL '10 days');
END $$;
