package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountRes;
import kr.co.kfs.asseterp.biz.sys.dto.CorpAccountSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys17_corp_account.xml + UpdateDataModel(sys17_corp_account) */
@Mapper
public interface SysCorpAccountMapper {
    List<CorpAccountRes> selectByCorpId(@Param("corpId") Long corpId);

    CorpAccountRes selectById(@Param("corpAccountId") Long corpAccountId);

    Long selectNextId();

    /** AS-IS dbConfig.getEncrypts */
    String getEncrypts(@Param("text") String text);

    int insertCorpAccount(@Param("id") Long id, @Param("corpId") Long corpId, @Param("accountNoEnc") String accountNoEnc,
                          @Param("req") CorpAccountSaveReq req);

    int updateCorpAccount(@Param("corpId") Long corpId, @Param("accountNoEnc") String accountNoEnc,
                          @Param("req") CorpAccountSaveReq req);

    int deleteCorpAccounts(@Param("corpId") Long corpId, @Param("corpAccountIds") List<Long> corpAccountIds);
}
