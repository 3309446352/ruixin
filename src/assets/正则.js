        //�������֤��Ϣ  ע������
        let o = {
          phone: {
            value: this.userRegisterInfo.phone,
            errorMsg: '�ֻ��Ÿ�ʽ����ȷ',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userRegisterInfo.password,
            errorMsg: '������������ĸ�»������(6-16�ַ�)',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.userRegisterInfo.nickName,
            errorMsg: '�ǳ�����ĸ�����»��ߺ������(1-10�ַ�)',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          },
        };

        let isPass = validForm.valid(o);