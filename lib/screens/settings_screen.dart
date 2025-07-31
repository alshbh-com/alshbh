import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'الإعدادات',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFFFF6B35),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // معلومات التطبيق
          _buildSection(
            title: 'معلومات التطبيق',
            children: [
              _buildSettingItem(
                icon: Icons.info_outline,
                title: 'حول التطبيق',
                subtitle: 'طلباتك - خدمة التوصيل الأفضل',
                onTap: () => _showAboutDialog(context),
              ),
              _buildSettingItem(
                icon: Icons.star_rate,
                title: 'قيم التطبيق',
                subtitle: 'ساعدنا في تحسين خدمتنا',
                onTap: () => _showRatingDialog(context),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // خدمة العملاء
          _buildSection(
            title: 'خدمة العملاء',
            children: [
              _buildSettingItem(
                icon: Icons.support_agent,
                title: 'تواصل مع الدعم',
                subtitle: 'للاستفسارات والمساعدة',
                onTap: () => _contactSupport(),
              ),
              _buildSettingItem(
                icon: Icons.help_outline,
                title: 'الأسئلة الشائعة',
                subtitle: 'إجابات للأسئلة المتكررة',
                onTap: () => _showFAQ(context),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // للمطورين والشركاء
          _buildSection(
            title: 'للمطورين والشركاء',
            children: [
              _buildSettingItem(
                icon: Icons.code,
                title: 'تواصل مع المطور',
                subtitle: 'لطلب تطبيق أو موقع جديد',
                onTap: () => _contactDeveloper(),
              ),
              _buildSettingItem(
                icon: Icons.web,
                title: 'موقع المطور',
                subtitle: 'تعرف على خدماتنا',
                onTap: () => _openDeveloperWebsite(),
              ),
              _buildSettingItem(
                icon: Icons.store_mall_directory,
                title: 'أضف متجرك أو مطعمك',
                subtitle: 'انضم إلى شبكة شركائنا',
                onTap: () => _addStore(),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // الميزات الإضافية
          _buildSection(
            title: 'الميزات الإضافية',
            children: [
              _buildSettingItem(
                icon: Icons.restaurant_menu,
                title: 'وضع "أنا جائع"',
                subtitle: 'اقتراحات سريعة للوجبات',
                onTap: () => _showHungryMode(context),
              ),
              _buildSettingItem(
                icon: Icons.mood,
                title: 'اقتراحات حسب المزاج',
                subtitle: 'وجبات تناسب مزاجك',
                onTap: () => _showMoodSuggestions(context),
              ),
              _buildSettingItem(
                icon: Icons.mic,
                title: 'الطلب الصوتي',
                subtitle: 'اطلب بصوتك',
                onTap: () => _showVoiceOrder(context),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // إعدادات أخرى
          _buildSection(
            title: 'إعدادات أخرى',
            children: [
              _buildSettingItem(
                icon: Icons.notifications_outlined,
                title: 'الإشعارات',
                subtitle: 'إدارة إشعارات التطبيق',
                onTap: () => _showNotificationSettings(context),
              ),
              _buildSettingItem(
                icon: Icons.language,
                title: 'اللغة',
                subtitle: 'العربية',
                onTap: () => _showLanguageSettings(context),
              ),
              _buildSettingItem(
                icon: Icons.privacy_tip_outlined,
                title: 'سياسة الخصوصية',
                subtitle: 'كيف نحمي بياناتك',
                onTap: () => _showPrivacyPolicy(context),
              ),
            ],
          ),

          const SizedBox(height: 40),

          // معلومات الإصدار
          Center(
            child: Column(
              children: [
                Text(
                  'طلباتك',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'الإصدار 1.0.0',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection({required String title, required List<Widget> children}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFFFF6B35),
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFFFF6B35).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(
                  icon,
                  color: const Color(0xFFFF6B35),
                  size: 20,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('حول التطبيق'),
        content: const Text(
          'طلباتك هو تطبيق توصيل شامل يهدف إلى تقديم أفضل خدمة توصيل في مصر. '
          'نحن نخدم حالياً محافظة القليوبية وسنتوسع قريباً لتغطية جميع المحافظات.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showRatingDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('قيم التطبيق'),
        content: const Text(
          'هل أعجبك التطبيق؟ قيمنا على متجر التطبيقات لمساعدة الآخرين في اكتشافنا!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('لاحقاً'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // فتح متجر التطبيقات للتقييم
            },
            child: const Text('قيم الآن'),
          ),
        ],
      ),
    );
  }

  Future<void> _contactSupport() async {
    const whatsappUrl = 'https://wa.me/201204486263?text=مرحباً، أحتاج مساعدة في تطبيق طلباتك';
    if (await canLaunchUrl(Uri.parse(whatsappUrl))) {
      await launchUrl(Uri.parse(whatsappUrl), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _contactDeveloper() async {
    const whatsappUrl = 'https://wa.me/201204486263?text=مرحباً، أريد الاستفسار عن تطوير تطبيق أو موقع جديد';
    if (await canLaunchUrl(Uri.parse(whatsappUrl))) {
      await launchUrl(Uri.parse(whatsappUrl), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _openDeveloperWebsite() async {
    // يمكن تحديث هذا الرابط لاحقاً
    const websiteUrl = 'https://example.com';
    if (await canLaunchUrl(Uri.parse(websiteUrl))) {
      await launchUrl(Uri.parse(websiteUrl), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _addStore() async {
    const whatsappUrl = 'https://wa.me/201204486263?text=مرحباً، أريد إضافة متجري/مطعمي إلى تطبيق طلباتك';
    if (await canLaunchUrl(Uri.parse(whatsappUrl))) {
      await launchUrl(Uri.parse(whatsappUrl), mode: LaunchMode.externalApplication);
    }
  }

  void _showHungryMode(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('وضع "أنا جائع"'),
        content: const Text(
          'هذه الميزة ستقترح عليك أقرب 5 وجبات متاحة للتوصيل الفوري بناءً على:\n'
          '• أقرب المطاعم المفتوحة\n'
          '• أقصر وقت توصيل\n'
          '• التقييمات العالية\n\n'
          'قريباً في التحديثات القادمة!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showMoodSuggestions(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('اقتراحات حسب المزاج'),
        content: const Text(
          'اختر مزاجك وسنقترح عليك الوجبات المناسبة:\n'
          '• ملل: وجبات متنوعة ومثيرة\n'
          '• جوع شديد: وجبات مشبعة\n'
          '• عجلة: وجبات سريعة\n'
          '• دايت: سلطات وأكل صحي\n\n'
          'قريباً في التحديثات القادمة!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showVoiceOrder(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الطلب الصوتي'),
        content: const Text(
          'اطلب بصوتك! قل مثلاً:\n'
          '"أريد بيتزا متوسطة بالجبنة الإضافية"\n\n'
          'وسيحلل التطبيق طلبك ويقترح أقرب وجبة مطابقة.\n\n'
          'قريباً في التحديثات القادمة!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showFAQ(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الأسئلة الشائعة'),
        content: const SingleChildScrollView(
          child: Text(
            'س: ما هي المناطق المخدومة؟\n'
            'ج: نخدم حالياً محافظة القليوبية وسنتوسع قريباً.\n\n'
            'س: ما هي طرق الدفع المتاحة؟\n'
            'ج: الدفع عند الاستلام فقط حالياً.\n\n'
            'س: كم يستغرق التوصيل؟\n'
            'ج: يختلف حسب المنطقة والمطعم، عادة 30-60 دقيقة.\n\n'
            'س: هل يمكنني إلغاء الطلب؟\n'
            'ج: يمكنك التواصل مع المطعم مباشرة عبر واتساب.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showNotificationSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعدادات الإشعارات'),
        content: const Text(
          'يمكنك إدارة إشعارات التطبيق من إعدادات الهاتف.\n\n'
          'الإشعارات تساعدك في متابعة حالة طلباتك والعروض الجديدة.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showLanguageSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعدادات اللغة'),
        content: const Text(
          'التطبيق متاح حالياً باللغة العربية.\n\n'
          'سنضيف المزيد من اللغات في التحديثات القادمة.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }

  void _showPrivacyPolicy(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('سياسة الخصوصية'),
        content: const SingleChildScrollView(
          child: Text(
            'نحن نحترم خصوصيتك ونحمي بياناتك الشخصية.\n\n'
            'البيانات التي نجمعها:\n'
            '• الاسم ورقم الهاتف للتوصيل\n'
            '• الموقع لتحديد المنطقة\n'
            '• تفاصيل الطلبات\n\n'
            'كيف نستخدم البيانات:\n'
            '• تنفيذ وتوصيل الطلبات\n'
            '• تحسين الخدمة\n'
            '• التواصل معك عند الحاجة\n\n'
            'لا نشارك بياناتك مع أطراف ثالثة إلا للضرورة القصوى.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('موافق'),
          ),
        ],
      ),
    );
  }
}

