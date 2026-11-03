/**
 * eSchool Backend API Server (Port 3500)
 * Norme MINESEC Cameroun
 * Implémente l'ensemble des spécifications API_REQUESTS_RESPONSES.md
 */

import http from 'http';
import { URL } from 'url';

const PORT = 3500;
const HOST = '0.0.0.0';

// JWT Helper
function createJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  // Simple HMAC-like signature representation for development
  const signature = Buffer.from(`${base64Header}.${base64Payload}.secret_signature_eschool_2026`).toString('base64url');
  return `${base64Header}.${base64Payload}.${signature}`;
}

function decodeJwt(token) {
  try {
    const parts = token.replace('Bearer ', '').trim().split('.');
    if (parts.length < 2) return null;
    const json = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// In-Memory Database initialized with MINESEC standards
const db = {
  users: [
    {
      id: 'usr_superadmin_0',
      email: 'superadmin@eschool.com',
      password: 'superadmin123',
      firstName: 'Alain',
      lastName: 'Biya',
      role: 'SUPERADMIN',
      phone: '+237 699 00 00 00',
      status: 'ACTIVE'
    },
    {
      id: 'usr_admin_1',
      email: 'admin@eschool.com',
      password: 'admin123',
      firstName: 'Proviseur',
      lastName: 'Directeur',
      role: 'ADMIN',
      phone: '+237 690 00 00 01',
      status: 'ACTIVE'
    },
    {
      id: 'usr_teacher_1',
      email: 'teacher@eschool.com',
      password: 'teacher123',
      firstName: 'Alain',
      lastName: 'Fokam',
      role: 'ENSEIGNANT',
      phone: '+237 677 88 99 00',
      status: 'ACTIVE'
    },
    {
      id: 'usr_teacher_2',
      email: 'prof.fokam@eschool.cm',
      password: 'prof123',
      firstName: 'Alain',
      lastName: 'Fokam',
      role: 'ENSEIGNANT',
      phone: '+237 677 88 99 01',
      status: 'ACTIVE'
    },
    {
      id: 'usr_parent_1',
      email: 'parent@eschool.com',
      password: 'parent123',
      firstName: 'Paul',
      lastName: 'Kamga',
      role: 'PARENT',
      phone: '+237 655 44 33 22',
      status: 'ACTIVE'
    },
    {
      id: 'usr_eleve_1',
      email: 'eleve@eschool.com',
      password: 'eleve123',
      firstName: 'Junior',
      lastName: 'Biloa',
      role: 'ELEVE',
      phone: '+237 690 11 22 33',
      status: 'ACTIVE'
    }
  ],
  schools: [
    {
      id: 'sch_1',
      name: 'Lycée Général Leclerc de Yaoundé',
      code: 'LGL-YDE-001',
      address: 'BP 124 Yaoundé, Centre',
      phone: '+237 222 22 00 01',
      email: 'contact@leclerc.cm',
      ville: 'Yaoundé',
      region: 'Centre',
      slogan: 'Travail - Rigueur - Réussite',
      timezone: 'Africa/Douala',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sch_2',
      name: 'Collège Bilingue Polyvalent Deido',
      code: 'CBPD-DLA-002',
      address: 'Rue Deido, Douala',
      phone: '+237 233 42 11 22',
      email: 'contact@college-deido.cm',
      ville: 'Douala',
      region: 'Littoral',
      slogan: 'L\'Excellence Bilingue',
      timezone: 'Africa/Douala',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  classes: [
    {
      id: 'cls_1',
      name: 'Terminale C',
      level: 'Terminale',
      section: 'Scientifique',
      capacity: 45,
      status: 'ACTIVE',
      schoolYearId: 'sy_2025_2026',
      schoolId: 'sch_1',
      teacherId: 'tch_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cls_2',
      name: 'Première A4 Allemand',
      level: 'Première',
      section: 'Littéraire',
      capacity: 45,
      status: 'ACTIVE',
      schoolYearId: 'sy_2025_2026',
      schoolId: 'sch_1',
      teacherId: 'tch_2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cls_3',
      name: 'Troisième Allemand',
      level: 'Troisième',
      section: 'Général',
      capacity: 50,
      status: 'ACTIVE',
      schoolYearId: 'sy_2025_2026',
      schoolId: 'sch_1',
      teacherId: 'tch_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cls_4',
      name: 'Sixième A',
      level: 'Sixième',
      section: 'Général',
      capacity: 55,
      status: 'ACTIVE',
      schoolYearId: 'sy_2025_2026',
      schoolId: 'sch_1',
      teacherId: 'tch_2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  students: [
    {
      id: 'std_1',
      matricule: '2026-LGL-001',
      firstName: 'Junior',
      lastName: 'Biloa',
      dateOfBirth: '2008-04-12T00:00:00.000Z',
      placeOfBirth: 'Yaoundé',
      gender: 'M',
      bloodGroup: 'O+',
      nationality: 'Camerounaise',
      address: 'Bastos, Yaoundé',
      schoolId: 'sch_1',
      classId: 'cls_1',
      classeNom: 'Terminale C',
      etablissementNom: 'Lycée Général Leclerc de Yaoundé',
      statutFrais: 'SOLDE',
      montantPaye: 65000,
      montantTotal: 65000,
      parentContact: {
        fatherName: 'Alphonse Biloa',
        fatherPhone: '+237 699 11 22 33',
        motherName: 'Chantal Biloa',
        motherPhone: '+237 677 44 55 66',
        emergencyContact: '+237 699 11 22 33'
      },
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'std_2',
      matricule: '2026-LGL-002',
      firstName: 'Aminatou',
      lastName: 'Oumarou',
      dateOfBirth: '2009-09-25T00:00:00.000Z',
      placeOfBirth: 'Garoua',
      gender: 'F',
      bloodGroup: 'B+',
      nationality: 'Camerounaise',
      address: 'Biyem-Assi, Yaoundé',
      schoolId: 'sch_1',
      classId: 'cls_2',
      classeNom: 'Première A4 Allemand',
      etablissementNom: 'Lycée Général Leclerc de Yaoundé',
      statutFrais: 'PARTIEL',
      montantPaye: 35000,
      montantTotal: 65000,
      parentContact: {
        fatherName: 'Bouba Oumarou',
        fatherPhone: '+237 694 55 11 23',
        emergencyContact: '+237 694 55 11 23'
      },
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  subjects: [
    {
      id: 'sbj_1',
      name: 'Mathématiques',
      code: 'MATH',
      credits: 4,
      level: 'Première',
      section: 'Scientifique',
      schoolId: 'sch_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sbj_2',
      name: 'Physique-Chimie',
      code: 'PC',
      credits: 3,
      level: 'Première',
      section: 'Scientifique',
      schoolId: 'sch_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sbj_3',
      name: 'Littérature / Français',
      code: 'FRAN',
      credits: 4,
      level: 'Première',
      section: 'Littéraire',
      schoolId: 'sch_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  grades: [
    {
      id: 'grd_1',
      studentId: 'std_1',
      subjectId: 'sbj_1',
      matiereNom: 'Mathématiques',
      coefficient: 4,
      score: 16.5,
      maxScore: 20,
      termId: 'trimestre_1',
      sequenceId: 'seq_1',
      type: 'SEQUENCE',
      periode: 'Séquence 1',
      appreciation: 'Très Bon Travail',
      recordedBy: 'usr_teacher_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'grd_2',
      studentId: 'std_1',
      subjectId: 'sbj_2',
      matiereNom: 'Physique-Chimie',
      coefficient: 3,
      score: 14.0,
      maxScore: 20,
      termId: 'trimestre_1',
      sequenceId: 'seq_1',
      type: 'SEQUENCE',
      periode: 'Séquence 1',
      appreciation: 'Bon Travail',
      recordedBy: 'usr_teacher_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  timetableSlots: [
    {
      id: 'slt_1',
      classId: 'cls_1',
      subjectId: 'sbj_1',
      teacherId: 'tch_1',
      dayOfWeek: 1, // Lundi
      dayName: 'Lundi',
      startTime: '07:30',
      endTime: '09:20',
      room: 'Salle 12',
      schoolId: 'sch_1'
    },
    {
      id: 'slt_2',
      classId: 'cls_1',
      subjectId: 'sbj_2',
      teacherId: 'tch_2',
      dayOfWeek: 1,
      dayName: 'Lundi',
      startTime: '09:30',
      endTime: '11:20',
      room: 'Laboratoire 2',
      schoolId: 'sch_1'
    }
  ],
  payments: [
    {
      id: 'pay_1',
      receiptNumber: 'REC-2026-LGL-00089',
      studentId: 'std_1',
      studentMatricule: '2026-LGL-001',
      studentFullName: 'Junior Biloa',
      className: 'Terminale C',
      schoolId: 'sch_1',
      schoolName: 'Lycée Général Leclerc de Yaoundé',
      amount: 45000,
      currency: 'XAF',
      feeType: 'SCOLARITE_TRANCHE_1',
      feeDescription: '1ère Tranche Frais d\'Inscription et APEE',
      paymentMethod: 'MTN_MOMO',
      transactionId: 'MOMO-CMR-981273912',
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
      cashier: 'Intendant M. Mbarga'
    },
    {
      id: 'pay_2',
      receiptNumber: 'REC-2026-LGL-00090',
      studentId: 'std_2',
      studentMatricule: '2026-LGL-002',
      studentFullName: 'Aminatou Oumarou',
      className: 'Première A4 Allemand',
      schoolId: 'sch_1',
      schoolName: 'Lycée Général Leclerc de Yaoundé',
      amount: 35000,
      currency: 'XAF',
      feeType: 'SCOLARITE_TRANCHE_1',
      feeDescription: '1ère Tranche Scolarité',
      paymentMethod: 'ORANGE_MONEY',
      transactionId: 'OM-CMR-847291',
      status: 'SUCCESS',
      paidAt: new Date().toISOString(),
      cashier: 'Intendance eSchool'
    }
  ],
  teachers: [
    {
      id: 'tch_1',
      name: 'Jean DUPONT',
      email: 'j.dupont@ecole.com',
      phone: '+237 699 00 11 22',
      subjects: ['Mathématiques', 'Physique-Chimie'],
      classes: ['6ème A', '3ème B', 'Terminale C'],
      isAdmin: true,
      matricule: 'ENS-2024-001'
    },
    {
      id: 'tch_2',
      name: 'Marie SMITH',
      email: 'm.smith@ecole.com',
      phone: '+237 677 33 44 55',
      subjects: ['Anglais'],
      classes: ['6ème A', '5ème B', 'Terminale C'],
      isAdmin: false,
      matricule: 'ENS-2024-002'
    },
    {
      id: 'tch_3',
      name: 'Paul LEFEBVRE',
      email: 'p.lefebvre@ecole.com',
      phone: '+237 655 77 88 99',
      subjects: ['SVT'],
      classes: ['3ème B', '2nde C'],
      isAdmin: false,
      matricule: 'ENS-2024-003'
    },
    {
      id: 'tch_4',
      name: 'Alice MVE',
      email: 'a.mve@ecole.com',
      phone: '+237 688 11 22 33',
      subjects: ['Mathématiques'],
      classes: ['4ème A', 'Terminale C'],
      isAdmin: false,
      matricule: 'ENS-2024-004'
    }
  ],
  disciplineIncidents: [],
  exitTickets: []
};

// Response helper
function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

// Request Body Parser
function parseBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3500'}`);
  let pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';
  // Normalize `/v1/api` or `/api/v1`
  if (pathname.startsWith('/v1/api')) {
    pathname = pathname.replace('/v1/api', '/api/v1');
  }

  const authHeader = req.headers.authorization || '';
  const tokenPayload = decodeJwt(authHeader);

  console.log(`[API Server 3500] ${req.method} ${pathname}`);

  try {
    // 1. HEALTHCHECK
    if (pathname === '/' || pathname === '/health' || pathname === '/api/v1/health') {
      return sendJson(res, 200, {
        status: 'UP',
        service: 'eSchool Backend MINESEC API',
        timestamp: new Date().toISOString()
      });
    }

    // 2. AUTH: LOGIN (POST /api/v1/auth/login)
    if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      if (!email || !password) {
        return sendJson(res, 400, {
          success: false,
          message: 'Veuillez renseigner votre email et mot de passe.',
          timestamp: new Date().toISOString()
        });
      }

      // Check if user exists in db
      let user = db.users.find(u => u.email.toLowerCase() === email);

      // If user not in initial db, determine realistic MINESEC role or accept credentials
      if (!user) {
        let role = 'ADMIN';
        if (email.includes('superadmin')) role = 'SUPERADMIN';
        else if (email.includes('prof') || email.includes('teacher') || email.includes('enseignant')) role = 'ENSEIGNANT';
        else if (email.includes('parent')) role = 'PARENT';
        else if (email.includes('eleve') || email.includes('student')) role = 'ELEVE';

        user = {
          id: `usr_${Date.now()}`,
          email: body.email,
          password: password,
          firstName: email.split('@')[0].split('.')[0] || 'Utilisateur',
          lastName: email.split('@')[0].split('.')[1] || 'eSchool',
          role: role,
          phone: '+237 690 00 00 00',
          status: 'ACTIVE'
        };
        db.users.push(user);
      } else if (user.password && user.password !== password) {
        // Simple check: if provided known demo user with wrong password
        return sendJson(res, 401, {
          success: false,
          message: 'Identifiants invalides. Vérifiez votre mot de passe.',
          timestamp: new Date().toISOString()
        });
      }

      const jwtPayload = {
        sub: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600), // 7 days
        iat: Math.floor(Date.now() / 1000),
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };

      const token = createJwt(jwtPayload);

      return sendJson(res, 200, {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token: token
        },
        timestamp: new Date().toISOString()
      });
    }

    // 3. AUTH: PROFILE (GET /api/v1/auth/profile)
    if (pathname === '/api/v1/auth/profile' && req.method === 'GET') {
      if (!tokenPayload) {
        return sendJson(res, 401, {
          success: false,
          message: 'Jeton d\'authentification invalide ou manquant.',
          timestamp: new Date().toISOString()
        });
      }

      const user = db.users.find(u => u.id === tokenPayload.id || u.email === tokenPayload.email) || {
        id: tokenPayload.id || 'usr_default',
        email: tokenPayload.email || 'user@eschool.cm',
        firstName: tokenPayload.firstName || 'Utilisateur',
        lastName: tokenPayload.lastName || 'Connecté',
        role: tokenPayload.role || 'ADMIN',
        status: 'ACTIVE',
        phone: '+237 690 00 00 01'
      };

      return sendJson(res, 200, {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status || 'ACTIVE',
          phone: user.phone || '+237 690 00 00 01'
        },
        timestamp: new Date().toISOString()
      });
    }

    // 4. AUTH: REGISTER (POST /api/v1/auth/register)
    if (pathname === '/api/v1/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      const newUser = {
        id: `usr_${Date.now()}`,
        email: body.email,
        password: body.password || 'eschool123',
        firstName: body.firstName || body.prenom || 'Nouveau',
        lastName: body.lastName || body.nom || 'Membre',
        role: body.role || 'ENSEIGNANT',
        phone: body.phone || '+237 690 00 00 00',
        status: 'ACTIVE'
      };
      db.users.push(newUser);

      const token = createJwt({
        sub: newUser.id,
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600)
      });

      return sendJson(res, 201, {
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
          },
          token: token
        },
        timestamp: new Date().toISOString()
      });
    }

    // 5. SCHOOLS: GET /api/v1/schools, POST /api/v1/schools
    if (pathname === '/api/v1/schools') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.schools,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newSchool = {
          id: `sch_${Date.now()}`,
          name: body.name || body.nom || 'Nouvel Établissement',
          code: body.code || `SCH-${Math.floor(100 + Math.random() * 900)}`,
          address: body.address || `${body.ville || 'Yaoundé'}, Cameroun`,
          phone: body.phone || '+237 222 00 00 00',
          email: body.email || 'contact@ecole.cm',
          ville: body.ville || 'Yaoundé',
          region: body.region || 'Centre',
          slogan: body.slogan || 'Discipline - Travail - Succès',
          timezone: 'Africa/Douala',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.schools.push(newSchool);
        return sendJson(res, 201, {
          success: true,
          data: newSchool,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 6. SCHOOL STATS: GET /api/v1/schools/:id/stats
    const schoolStatsMatch = pathname.match(/^\/api\/v1\/schools\/([^/]+)\/stats$/);
    if (schoolStatsMatch && req.method === 'GET') {
      const schoolId = schoolStatsMatch[1];
      const school = db.schools.find(s => s.id === schoolId) || db.schools[0];
      return sendJson(res, 200, {
        success: true,
        data: {
          schoolId: school.id,
          schoolName: school.name,
          totalStudents: db.students.length,
          activeStudents: db.students.length,
          totalTeachers: db.users.filter(u => u.role === 'ENSEIGNANT').length,
          totalClasses: db.classes.length,
          totalRevenue: db.payments.reduce((acc, p) => acc + (p.amount || 0), 0),
          currency: 'XAF (FCFA)'
        },
        timestamp: new Date().toISOString()
      });
    }

    // 7. CLASSES: GET /api/v1/classes, POST /api/v1/classes
    if (pathname === '/api/v1/classes') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.classes,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newClass = {
          id: `cls_${Date.now()}`,
          name: body.name || body.nom || 'Nouvelle Classe',
          level: body.level || body.niveau || 'Sixième',
          section: body.section || 'Général',
          capacity: body.capacity || 45,
          status: 'ACTIVE',
          schoolYearId: body.schoolYearId || 'sy_2025_2026',
          schoolId: body.schoolId || 'sch_1',
          teacherId: body.teacherId || 'tch_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.classes.push(newClass);
        return sendJson(res, 201, {
          success: true,
          data: newClass,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 8. CLASS STUDENTS: GET /api/v1/classes/:id/students
    const classStudentsMatch = pathname.match(/^\/api\/v1\/classes\/([^/]+)\/students$/);
    if (classStudentsMatch && req.method === 'GET') {
      const classId = classStudentsMatch[1];
      const students = db.students.filter(s => s.classId === classId);
      return sendJson(res, 200, {
        success: true,
        data: students,
        timestamp: new Date().toISOString()
      });
    }

    // 9. STUDENTS: GET /api/v1/students, POST /api/v1/students
    if (pathname === '/api/v1/students') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.students,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const targetClass = db.classes.find(c => c.id === body.classId) || db.classes[0];
        const newStudent = {
          id: `std_${Date.now()}`,
          matricule: body.matricule || `2026-MINESEC-${Math.floor(1000 + Math.random() * 9000)}`,
          firstName: body.firstName || body.prenom || '',
          lastName: body.lastName || body.nom || '',
          dateOfBirth: body.dateOfBirth || '2009-01-01',
          placeOfBirth: body.placeOfBirth || body.lieuNaissance || 'Cameroun',
          gender: body.gender || 'M',
          bloodGroup: body.bloodGroup || 'O+',
          nationality: body.nationality || 'Camerounaise',
          address: body.address || 'Yaoundé',
          schoolId: body.schoolId || 'sch_1',
          classId: targetClass.id,
          classeNom: targetClass.name,
          etablissementNom: 'Lycée Général Leclerc de Yaoundé',
          statutFrais: 'IMPAYE',
          montantPaye: 0,
          montantTotal: 65000,
          parentContact: body.parentContact || {
            fatherName: body.nomPere || 'Parent Tuteur',
            fatherPhone: body.telParent || '+237 690 00 00 00',
            emergencyContact: body.telUrgence || '+237 690 00 00 00'
          },
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.students.push(newStudent);
        return sendJson(res, 201, {
          success: true,
          data: newStudent,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 10. SUBJECTS: GET /api/v1/subjects, POST /api/v1/subjects
    if (pathname === '/api/v1/subjects') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.subjects,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newSubject = {
          id: `sbj_${Date.now()}`,
          name: body.name || body.nom,
          code: body.code || 'MAT',
          credits: body.credits || body.coefficient || 3,
          level: body.level || 'Général',
          section: body.section || 'Scientifique',
          schoolId: body.schoolId || 'sch_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.subjects.push(newSubject);
        return sendJson(res, 201, {
          success: true,
          data: newSubject,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 11. TIMETABLE: POST /api/v1/timetable/slots, GET /api/v1/timetable/class/:id
    if (pathname === '/api/v1/timetable/slots' && req.method === 'POST') {
      const body = await parseBody(req);
      const newSlot = {
        id: `slt_${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString()
      };
      db.timetableSlots.push(newSlot);
      return sendJson(res, 201, {
        success: true,
        data: newSlot,
        timestamp: new Date().toISOString()
      });
    }

    const timetableClassMatch = pathname.match(/^\/api\/v1\/timetable\/class\/([^/]+)$/);
    if (timetableClassMatch && req.method === 'GET') {
      const classId = timetableClassMatch[1];
      const slots = db.timetableSlots.filter(s => s.classId === classId);
      return sendJson(res, 200, {
        success: true,
        data: slots.length > 0 ? slots : db.timetableSlots,
        timestamp: new Date().toISOString()
      });
    }

    // 12. GRADES: GET /api/v1/grades, POST /api/v1/grades
    if (pathname === '/api/v1/grades') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.grades,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newGrade = {
          id: `grd_${Date.now()}`,
          studentId: body.studentId,
          subjectId: body.subjectId,
          score: body.score,
          maxScore: body.maxScore || 20,
          termId: body.termId || 'trimestre_1',
          sequenceId: body.sequenceId || 'seq_1',
          type: body.type || 'SEQUENCE',
          appreciation: body.score >= 16 ? 'Très Bien' : body.score >= 12 ? 'Assez Bien' : body.score >= 10 ? 'Passable' : 'Insuffisant',
          recordedBy: tokenPayload?.id || 'usr_teacher_1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.grades.push(newGrade);
        return sendJson(res, 201, {
          success: true,
          data: newGrade,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 13. REPORT CARDS (MINESEC): GET /api/v1/grades/report-cards/student/:studentId/term/:termId
    const reportCardMatch = pathname.match(/^\/api\/v1\/grades\/report-cards\/student\/([^/]+)\/term\/([^/]+)$/);
    if (reportCardMatch && req.method === 'GET') {
      const studentId = reportCardMatch[1];
      const termId = reportCardMatch[2];
      const student = db.students.find(s => s.id === studentId) || db.students[0];

      return sendJson(res, 200, {
        success: true,
        data: {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          class: student.classeNom || 'Terminale C',
          termId: termId,
          schoolYear: '2025/2026',
          subjects: [
            {
              subjectId: 'sbj_1',
              subjectName: 'Mathématiques',
              coefficient: 4,
              teacherName: 'M. Fokam',
              seq1Score: 16.5,
              seq2Score: 15.0,
              termAverage: 15.75,
              weightedTotal: 63.0,
              rank: 2,
              appreciation: 'Très Bien'
            },
            {
              subjectId: 'sbj_2',
              subjectName: 'Physique-Chimie',
              coefficient: 3,
              teacherName: 'M. Kamga',
              seq1Score: 14.0,
              seq2Score: 13.5,
              termAverage: 13.75,
              weightedTotal: 41.25,
              rank: 4,
              appreciation: 'Bien'
            }
          ],
          summary: {
            totalCoefficients: 7,
            totalPoints: 104.25,
            generalAverage: 14.89,
            classAverage: 11.2,
            classRank: 2,
            totalStudents: 45,
            appreciationConseil: 'Tableau d\'Honneur avec Félicitations du Conseil',
            disciplinaryStatus: {
              unjustifiedAbsencesHours: 2,
              justifiedAbsencesHours: 0,
              warnings: 0,
              blames: 0,
              exclusionsDays: 0
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    // 14. PAYMENTS: POST /api/v1/payments/momo, GET /api/v1/payments/:id/receipt
    if (pathname === '/api/v1/payments/momo' && req.method === 'POST') {
      const body = await parseBody(req);
      const student = db.students.find(s => s.id === body.studentId) || db.students[0];
      const receiptNumber = `REC-2026-LGL-${Math.floor(10000 + Math.random() * 90000)}`;

      const newPayment = {
        id: `pay_${Date.now()}`,
        receiptNumber: receiptNumber,
        studentId: student.id,
        studentMatricule: student.matricule,
        studentFullName: `${student.firstName} ${student.lastName}`,
        className: student.classeNom || 'Terminale C',
        schoolId: student.schoolId || 'sch_1',
        amount: body.amount || 45000,
        currency: 'XAF',
        feeType: body.feeType || 'SCOLARITE_TRANCHE_1',
        paymentMethod: body.operator || 'MTN_MOMO',
        transactionId: `MOMO-${Date.now()}`,
        status: 'SUCCESS',
        paidAt: new Date().toISOString()
      };
      db.payments.push(newPayment);

      return sendJson(res, 201, {
        success: true,
        data: {
          transactionId: newPayment.transactionId,
          status: 'SUCCESS',
          amount: newPayment.amount,
          currency: 'XAF (FCFA)',
          receiptNumber: receiptNumber,
          payment: newPayment
        },
        timestamp: new Date().toISOString()
      });
    }

    const receiptMatch = pathname.match(/^\/api\/v1\/payments\/([^/]+)\/receipt$/);
    if (receiptMatch && req.method === 'GET') {
      const paymentId = receiptMatch[1];
      const payment = db.payments.find(p => p.id === paymentId) || db.payments[0];

      return sendJson(res, 200, {
        success: true,
        data: {
          receiptNumber: payment.receiptNumber,
          date: payment.paidAt,
          school: {
            name: 'Lycée Général Leclerc de Yaoundé',
            ministry: 'Ministère des Enseignements Secondaires (MINESEC)',
            delegation: 'Délégation Régionale du Centre',
            poBox: 'BP 124 Yaoundé',
            phone: '+237 222 22 00 01'
          },
          student: {
            matricule: payment.studentMatricule,
            fullName: payment.studentFullName,
            class: payment.className,
            schoolYear: '2025/2026'
          },
          payment: {
            amount: payment.amount,
            amountInWords: 'Quarante-Cinq Mille Francs CFA',
            feeType: payment.feeType,
            method: payment.paymentMethod,
            transactionId: payment.transactionId
          },
          cashier: payment.cashier || 'Service Financier eSchool'
        },
        timestamp: new Date().toISOString()
      });
    }

    // 15. DISCIPLINE: POST /api/v1/discipline/exit-tickets, POST /api/v1/discipline/incidents
    if (pathname === '/api/v1/discipline/exit-tickets' && req.method === 'POST') {
      const body = await parseBody(req);
      const ticket = {
        id: `ext_${Date.now()}`,
        ...body,
        status: 'AUTHORIZED',
        issuedAt: new Date().toISOString()
      };
      db.exitTickets.push(ticket);
      return sendJson(res, 201, {
        success: true,
        data: ticket,
        timestamp: new Date().toISOString()
      });
    }

    if (pathname === '/api/v1/discipline/incidents' && req.method === 'POST') {
      const body = await parseBody(req);
      const incident = {
        id: `inc_${Date.now()}`,
        ...body,
        status: 'LOGGED',
        createdAt: new Date().toISOString()
      };
      db.disciplineIncidents.push(incident);
      return sendJson(res, 201, {
        success: true,
        data: incident,
        timestamp: new Date().toISOString()
      });
    }

    // 16. PAYMENTS CRUD: GET /api/v1/payments, POST /api/v1/payments, DELETE /api/v1/payments/:id
    if (pathname === '/api/v1/payments') {
      if (req.method === 'GET') {
        const studentId = parsedUrl.searchParams.get('studentId');
        let results = db.payments;
        if (studentId) {
          results = results.filter(p => p.studentId === studentId);
        }
        return sendJson(res, 200, {
          success: true,
          data: results,
          total: results.length,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newPayment = {
          id: `pay_${Date.now()}`,
          receiptNumber: `REC-2026-LGL-${Math.floor(10000 + Math.random() * 90000)}`,
          studentId: body.studentId || 'std_1',
          studentFullName: body.label || body.studentFullName || 'Paiement Scolarité',
          amount: Number(body.amount) || 0,
          currency: 'XAF',
          feeType: body.type || body.category || 'Scolarité',
          paymentMethod: body.paymentMethod || 'CASH',
          status: 'SUCCESS',
          paidAt: new Date().toISOString(),
          description: body.description || body.label || '',
          category: body.category || 'Scolarité',
          type: body.type || 'income'
        };
        db.payments.unshift(newPayment);
        return sendJson(res, 201, {
          success: true,
          data: newPayment,
          timestamp: new Date().toISOString()
        });
      }
    }

    const paymentDeleteMatch = pathname.match(/^\/api\/v1\/payments\/([^/]+)$/);
    if (paymentDeleteMatch && req.method === 'DELETE') {
      const pId = paymentDeleteMatch[1];
      db.payments = db.payments.filter(p => p.id !== pId);
      return sendJson(res, 200, { success: true, message: 'Paiement supprimé' });
    }

    // 17. TEACHERS CRUD: GET /api/v1/teachers, POST /api/v1/teachers, DELETE /api/v1/teachers/:id
    if (pathname === '/api/v1/teachers') {
      if (req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          data: db.teachers,
          total: db.teachers.length,
          timestamp: new Date().toISOString()
        });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newTeacher = {
          id: `tch_${Date.now()}`,
          name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'Nouvel Enseignant',
          email: body.email || `prof.${Date.now()}@ecole.cm`,
          phone: body.phone || '+237 600 00 00 00',
          subjects: Array.isArray(body.subjects) ? body.subjects : [body.subject || 'Enseignement Général'],
          classes: Array.isArray(body.classes) ? body.classes : ['Terminale C'],
          isAdmin: Boolean(body.isAdmin),
          matricule: body.matricule || `ENS-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString()
        };
        db.teachers.push(newTeacher);
        return sendJson(res, 201, {
          success: true,
          data: newTeacher,
          timestamp: new Date().toISOString()
        });
      }
    }

    const teacherDeleteMatch = pathname.match(/^\/api\/v1\/teachers\/([^/]+)$/);
    if (teacherDeleteMatch && req.method === 'DELETE') {
      const tId = teacherDeleteMatch[1];
      db.teachers = db.teachers.filter(t => t.id !== tId);
      return sendJson(res, 200, { success: true, message: 'Enseignant retiré' });
    }

    // 18. CLASSES DELETE / PATCH
    const classIdMatch = pathname.match(/^\/api\/v1\/classes\/([^/]+)$/);
    if (classIdMatch) {
      const clsId = classIdMatch[1];
      if (req.method === 'DELETE') {
        db.classes = db.classes.filter(c => c.id !== clsId);
        return sendJson(res, 200, { success: true, message: 'Classe supprimée' });
      }
      if (req.method === 'PATCH') {
        const body = await parseBody(req);
        const clsIndex = db.classes.findIndex(c => c.id === clsId);
        if (clsIndex !== -1) {
          db.classes[clsIndex] = { ...db.classes[clsIndex], ...body, updatedAt: new Date().toISOString() };
          return sendJson(res, 200, { success: true, data: db.classes[clsIndex] });
        }
      }
    }

    // 19. SUBJECTS DELETE
    const subjectIdMatch = pathname.match(/^\/api\/v1\/subjects\/([^/]+)$/);
    if (subjectIdMatch && req.method === 'DELETE') {
      const sbjId = subjectIdMatch[1];
      db.subjects = db.subjects.filter(s => s.id !== sbjId);
      return sendJson(res, 200, { success: true, message: 'Matière supprimée' });
    }

    // Default Fallback for unspecified endpoints
    console.warn(`[API Server 3500] 404 Not Found: ${req.method} ${pathname}`);
    return sendJson(res, 404, {
      success: false,
      message: `Endpoint non trouvé: ${pathname}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`[API Server 3500] Error handling ${pathname}:`, err);
    return sendJson(res, 500, {
      success: false,
      message: 'Erreur interne du serveur API',
      error: err?.message,
      timestamp: new Date().toISOString()
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 [eSchool API] Serveur MINESEC actif et à l'écoute sur http://${HOST}:${PORT}`);
});
