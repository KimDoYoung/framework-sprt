package kr.co.kfs.asseterp.biz.sms.mapper;

import kr.co.kfs.asseterp.biz.sms.dto.SmsSendTargetRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp00_trans_info.xml selectByList (V04, Sms03_Lookup_SendList) */
@Mapper
public interface SmsSendListMapper {
    /** AS-IS emp00_trans_info.selectByList — 사번 순 */
    List<SmsSendTargetRes> selectByList(@Param("companyId") Long companyId, @Param("personIds") List<Long> personIds);

    /** 휴대폰 번호 (AS-IS는 화면이 들고 온 사원 모델의 번호를 썼다 — TOBE는 서버가 읽는다) */
    String selectMobile(@Param("companyId") Long companyId, @Param("personId") Long personId);
}
