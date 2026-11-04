package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.SmsNoticeTargetRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp93_sms_notice_target.xml + UpdateDataModel(emp93_sms_notice_target) 저장·삭제 */
@Mapper
public interface EmpSmsNoticeTargetMapper {
    /** AS-IS selectBySmsNoticeCode */
    List<SmsNoticeTargetRes> selectBySmsNoticeCode(@Param("companyId") Long companyId, @Param("smsNoticeCd") String smsNoticeCd);

    /** AS-IS selectById (저장 뒤 한 행) */
    SmsNoticeTargetRes selectById(@Param("companyId") Long companyId, @Param("smsNoticeTargetId") Long smsNoticeTargetId);

    Long selectNextId();

    int insert(@Param("id") Long id, @Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("smsNoticeCd") String smsNoticeCd, @Param("note") String note);

    /** 사원·구분은 바뀌지 않으므로 비고만 고친다(화면에서 편집 가능한 열은 비고뿐) */
    int updateNote(@Param("companyId") Long companyId, @Param("id") Long id, @Param("note") String note);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);
}
