        //构造表单验证信息  注册正则
        let o = {
          phone: {
            value: this.userRegisterInfo.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userRegisterInfo.password,
            errorMsg: '密码由数字字母下划线组合(6-16字符)',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.userRegisterInfo.nickName,
            errorMsg: '昵称由字母数字下划线汉字组合(1-10字符)',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          },
        };

        let isPass = validForm.valid(o);