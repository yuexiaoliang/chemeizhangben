const fs = require('fs');

const shortid = require('shortid');
const moment = require('moment');

const data = {};

// 创建会员数据
(() => {
    // 添加会员
    for (let i = 0; i < 20; i++) {
        const id = i;
        const date = randomDate();
        const name = randomName();
        const weixin = getRandom(100000, 1999999999);
        const shouji = getRandom(10000000000, 19999999999);
        const money = getRandom(100, 3000);
        const member = {
            id,
            date,
            name,
            contact: {
                weixin,
                shouji,
            },
            ramarks: `${randomDate()}${shortid.generate()}${randomName()}`,
            carList: [],
            balance: money,
            rechargeRecord: [[date, money, randomTerrace()]],
            expensesRecord: [],
        };

        for (let j = 0; j < getRandom(1, 5); j++) {
            member.carList.push([
                `冀A·${getRandom(10000, 99999)}`,
                randomCarName(),
            ]);
        }
        data[id] = member;
    }
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const member = data[key];
            // 添加充值记录
            (() => {
                for (let j = 0; j < getRandom(1, 50); j++) {
                    const money = getRandom(100, 3000);
                    member.balance += money;
                    member.rechargeRecord.unshift([
                        randomDate(),
                        money,
                        randomTerrace(),
                    ]);
                }
            })();

            // 添加消费记录
            (() => {
                const serviceItems = [
                    ['洗车', 35],
                    ['打蜡', 150],
                    ['镀晶', 300],
                    ['内室精洗', 500],
                    ['琉晶', 800],
                ];
                for (let x = 0; x < getRandom(1, 30); x++) {
                    const expenses = [];
                    for (let j = 0; j < getRandom(1, 3); j++) {
                        const item =
                            serviceItems[getRandom(0, serviceItems.length - 1)];
                        member.balance -= item[1];
                        expenses.unshift(item);
                    }
                    member.expensesRecord.unshift([randomDate(), expenses]);
                }
            })();
        }
    }

    // 写入文件
    fs.writeFile('./database/members.json', JSON.stringify(data), function (
        err
    ) {
        if (err) {
            return console.error(err);
        }
    });
})();

// 创建普通数据
(() => {
    let data = {};
    // 添加会员
    for (let i = 0; i < 10; i++) {
        const chepaihao = `冀A·${getRandom(10000, 99999)}`;
        data[`${chepaihao}`] = {
            car: chepaihao,
            expensesRecord: [],
        };
        const serviceItems = [
            ['洗车', 35],
            ['打蜡', 150],
            ['镀晶', 300],
            ['内室精洗', 500],
            ['琉晶', 800],
        ];
        for (let x = 0; x < getRandom(1, 100); x++) {
            const date = randomDate();
            const expenses = [];
            for (let j = 0; j < getRandom(1, 3); j++) {
                const item =
                    serviceItems[getRandom(0, serviceItems.length - 1)];
                expenses.unshift(item);
            }
            console.log(data[`${chepaihao}`].expensesRecord);
            data[`${chepaihao}`].expensesRecord.unshift([
                randomDate(),
                randomCarName(),
                randomTerrace(),
                expenses,
            ]);
        }
    }

    // 写入文件;
    fs.writeFile('./database/ordinary.json', JSON.stringify(data), function (
        err
    ) {
        if (err) {
            return console.error(err);
        }
    });
})();

/**
 * 随机时间
 */
function randomDate() {
    var maxdaterandom = new Date().getTime();
    var mindaterandom = new Date(2020, 0, 1, 8).getTime();
    var randomdate = getRandom(mindaterandom, maxdaterandom);
    var datestr = moment(randomdate).format('YYYY-MM-DD HH:mm:ss');
    return datestr;
}

/**
 * 随机姓名
 */
function randomName() {
    const surname = `赵,钱,孙,李,周,吴,郑,王,冯,陈,褚,卫,蒋,沈,韩,杨,朱,秦,尤,许,何,吕,施,张,孔,曹,严,华,金,魏,陶,姜,戚,谢,邹,喻,柏,水,窦,章,云,苏,潘,葛,奚,范,彭,郎,鲁,韦,昌,马,苗,凤,花,方,俞,任,袁,柳,丰,鲍,史,唐,费,廉,岑,薛,雷,贺,倪,汤,滕,殷,罗,毕,郝,邬,安,常,乐,于,时,傅,皮,卞,齐,康,伍,余,元,卜,顾,孟,平,黄,和,穆,萧,尹,姚,邵,湛,汪,祁,毛,禹,狄,米,贝,明,臧,计,伏,成,戴,谈,宋,茅,庞,熊,纪,舒,屈,项,祝,董,梁,杜,阮,蓝,闵,席,季,麻,强,贾,路,娄,危,江,童,颜,郭,梅,盛,林,刁,钟,徐,丘,骆,高,夏,蔡,田,樊,胡,凌,霍,虞,万,支,柯,昝,管,卢,莫,经,房,裘,缪,干,解,应,宗,丁,宣,贲,邓,郁,单,杭,洪,包,诸,左,石,崔,吉,钮,龚,程,嵇,邢,滑,裴,陆,荣,翁,荀,羊,於,惠,甄,麴,家,封,芮,羿,储,靳,汲,邴,糜,松,井,段,富,巫,乌,焦,巴,弓,牧,隗,山,谷,车,侯,宓,蓬,全,郗,班,仰,秋,仲,伊,宫,宁,仇,栾,暴,甘,钭,厉,戌,祖,武,符,刘,景,詹,束,龙,叶,幸,司,韶,郜,黎,蓟,薄,印,宿,白,怀,蒲,邰,从,鄂,索,咸,籍,赖,卓,蔺,屠,蒙,池,乔,阴,郁,胥,能,苍,双,闻,莘,党,翟,谭,贡,劳,逢,姬,申,扶,堵,冉,宰,郦,雍,郤,璩,桑,桂,濮,牛,寿,通,边,扈,燕,冀,郏,浦,尚,农,温,别,庄,晏,柴,瞿,阎,充,慕,连,茹,习,宦,艾,鱼,容,向,古,易,慎,戈,廖,庾,终,暨,居,衡,步,都,耿,满,弘,匡,国,文,寇,广,禄,阙,东,欧,殳,沃,利,蔚,越,菱,隆,师,巩,厍,聂,晃,勾,敖,融,冷,訾,辛,阚,那,简,饶,空,曾,毋,沙,乜,养,鞠,须,丰,巢,关,蒯,相,查,后,荆,红,游,竺,权,逯,盖,益,桓,公,万俟,司马,上官,欧阳,夏侯,诸葛,闻人,东方,赫连,皇甫,尉迟,公羊,澹台,公冶,宗政,濮阳,淳于,单于,太叔,申屠,公孙,仲孙,轩辕,令狐,钟离,宇文,长孙,慕容,司徒,司空`.split(
        ','
    );
    const givenname = `子璇,淼,国栋,夫子,瑞堂,甜,敏,尚,国贤,贺祥,晨涛,昊轩,易轩,益辰,益帆,益冉,瑾春,瑾昆,春齐,杨,文昊,东东,雄霖,浩晨,熙涵,溶溶,冰枫,欣欣,宜豪,欣慧,建政,美欣,淑慧,文轩,文杰,欣源,忠林,榕润,欣汝,慧嘉,新建,建林,亦菲,林,冰洁,佳欣,涵涵,禹辰,淳美,泽惠,伟洋,涵越,润丽,翔,淑华,晶莹,凌晶,苒溪,雨涵,嘉怡,佳毅,子辰,佳琪,紫轩,瑞辰,昕蕊,萌,x明远,欣宜,泽远,欣怡,佳怡,佳惠,晨茜,晨璐,运昊,汝鑫,淑君,晶滢,润莎,榕汕,佳钰,佳玉,晓庆,一鸣,语晨,添池,添昊,雨泽,雅晗,雅涵,清妍,诗悦,嘉乐,晨涵,天赫,玥傲,佳昊,天昊,萌萌,若萌`.split(
        ','
    );
    return (
        surname[getRandom(0, surname.length - 1)] +
        givenname[getRandom(0, givenname.length - 1)]
    );
}

/**
 * 随机车辆类型
 */
function randomCarName() {
    const carName = `奥迪,acschnitzer,baiartega,奔驰du,宝马,保zhi时捷,巴博斯,宝沃,大众,ktm,卡尔森,mini,欧宝,smart,startech,泰卡特,威dao兹曼,西雅特本田,丰田,光冈,铃木,雷克萨斯,朗世,马自达,讴歌,日产三菱,斯巴鲁,五十铃,英菲尼迪,起亚,双龙,现代别克,道奇,福特,gmc,jeep,凯迪拉克,克莱斯勒,林肯,乔治·巴顿,山姆,特斯拉,雪佛兰星客特标致,ds,雷诺,pgo,雪铁龙,阿斯顿·马丁,宾利,捷豹,路虎,劳斯莱斯,路特斯,迈凯伦,摩根noble,阿尔法·罗密欧,布加迪,法拉利,菲亚特,farallimazzanti,兰博基尼,玛莎拉蒂,帕加尼依维柯,科尼赛克,沃尔沃,斯柯达比亚迪,宝骏,北汽幻速,奔腾,北汽绅宝,北汽威旺,北汽制造,北京,北汽新能源,长安轿车长城,长安商用,昌河,长安跨越,长城华冠,成功,东风风行,东南,东风风神,东风小康,东风·郑州日产,东风风度,东风御风,福田,福迪,福汽启腾,飞驰商务车,广汽传祺,观致汽车,广汽吉奥广汽日野,哈弗,海马,红旗,华泰,黄海,哈飞,海马商用车,华颂,恒天汽车,海格,汇众江淮,吉利汽车,江铃,金杯,九龙,江南,江铃集团轻汽,金旅客车,开瑞,凯翼,卡威科瑞斯`.split(
        ','
    );
    return carName[getRandom(0, carName.length - 1)];
}

/**
 * 随机支付平台
 */
function randomTerrace() {
    const terrace = ['微信', '支付宝', '现金'];
    return terrace[getRandom(0, terrace.length - 1)];
}

/**
 * 区间随机数
 * @param {number} min 最小数
 * @param {number} max 最大数
 */
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
