package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.ActCodeOptionRes;
import kr.co.kfs.asseterp.biz.act.dto.ActLinkRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act14_link.xml — 이익제공(수령) 계정코드 연결 */
@Mapper
public interface ActLinkMapper {
    /** AS-IS selectByAccountCode */
    List<ActLinkRes> selectByAccountCode(@Param("companyId") Long companyId, @Param("accountCode") String accountCode);

    ActLinkRes selectById(@Param("linkId") Long linkId);

    Long selectNextId();

    /** AS-IS insert: 조회순서는 같은 계정의 MAX(seq)+1 */
    int insert(@Param("linkId") Long linkId, @Param("companyId") Long companyId, @Param("accountCode") String accountCode,
               @Param("provideContentCode") String provideContentCode);

    /** AS-IS insertUpdate: 이미 같은 연결이 있으면 건드리지 않고 없으면 넣는다 (seq는 비워 둔다 — 원본 그대로) */
    int insertUpdate(@Param("companyId") Long companyId, @Param("accountCode") String accountCode,
                     @Param("provideContentCode") String provideContentCode);

    /** UpdateDataModel UPDATE(seq) — 회사 조건을 더했다 */
    int updateSeq(@Param("companyId") Long companyId, @Param("linkId") Long linkId, @Param("seq") long seq);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS sys09_code.selectByKindCode('ProvideContentCode', 목적코드||'%') */
    List<ActCodeOptionRes> selectProvideContents(@Param("code") String code);
}
