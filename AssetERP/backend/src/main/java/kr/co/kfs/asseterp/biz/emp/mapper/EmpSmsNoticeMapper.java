package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp92_sms_notice.xml (selectByPersonId·check·insert·updateNoticeYn) */
@Mapper
public interface EmpSmsNoticeMapper {

    /** AS-IS emp92_sms_notice.selectByPersonId — 코드별 기본값: 앱 false·문자 true·메일 true */
    List<SmsNoticeRes> selectByPersonId(@Param("personId") Long personId);

    /** AS-IS emp92_sms_notice.check 의 건수 */
    int countByCode(@Param("personId") Long personId, @Param("smsNoticeCode") String smsNoticeCode);

    int insert(@Param("personId") Long personId, @Param("smsNoticeCode") String smsNoticeCode,
               @Param("talkNoticeYn") String talkNoticeYn, @Param("smsNoticeYn") String smsNoticeYn, @Param("mailNoticeYn") String mailNoticeYn);

    int updateNoticeYn(@Param("personId") Long personId, @Param("smsNoticeCode") String smsNoticeCode,
                       @Param("talkNoticeYn") String talkNoticeYn, @Param("smsNoticeYn") String smsNoticeYn, @Param("mailNoticeYn") String mailNoticeYn);
}
