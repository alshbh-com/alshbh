<?php
session_start();

// بيانات تسجيل الدخول للإدمن (يجب تغييرها في البيئة الحقيقية)
$admin_username = "admin";
$admin_password = "admin123";

// التحقق من بيانات تسجيل الدخول إذا تم إرسال النموذج
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // التحقق من صحة بيانات الدخول
    if ($username === $admin_username && $password === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: admin-dashboard.php');
        exit;
    } else {
        $error = "اسم المستخدم أو كلمة المرور غير صحيحة";
    }
}

// إذا كان المدير مسجل دخول بالفعل، توجيهه للوحة التحكم
if (isset($_SESSION['admin_logged_in']) {
    header('Location: admin-dashboard.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل دخول الأدمن - توصيل الفهد</title>
    <link rel="stylesheet" href="admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* أنماط إضافية لصفحة تسجيل الدخول */
        body {
            background-color: #f5f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Arial', sans-serif;
        }
        
        .login-container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        
        .login-container h1 {
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 24px;
        }
        
        .login-logo {
            margin-bottom: 30px;
        }
        
        .login-logo img {
            height: 80px;
        }
        
        .form-group {
            margin-bottom: 20px;
            text-align: right;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #2c3e50;
            font-weight: bold;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            border-color: #e67e22;
            outline: none;
        }
        
        .login-btn {
            background-color: #e67e22;
            color: white;
            border: none;
            padding: 12px;
            width: 100%;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 10px;
        }
        
        .login-btn:hover {
            background-color: #d35400;
        }
        
        .error-message {
            color: #e74c3c;
            background-color: #fadbd8;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .forgot-password {
            margin-top: 15px;
            display: block;
            color: #7f8c8d;
            text-decoration: none;
            font-size: 14px;
        }
        
        .forgot-password:hover {
            color: #e67e22;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-logo">
            <img src="images/logo.png" alt="توصيل الفهد">
        </div>
        
        <h1>تسجيل دخول الأدمن</h1>
        
        <?php if (isset($error)): ?>
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">اسم المستخدم</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            
            <div class="form-group">
                <label for="password">كلمة المرور</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="login-btn">
                <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
            </button>
            
            <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
        </form>
    </div>
</body>
</html>